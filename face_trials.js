/* face_trials.js
   -------------------------------------------------------------------------
   Builds the 110-trial face perception task:
     face image + single-choice microexpression question shown together
     (each image shown exactly once, in the order given in imageList - NOT
     randomized); image + question stay on screen until the participant
     responds (no fixed duration)
     -> manipulated feedback (pre-generated, one of 4 between-subjects
        conditions). The face image stays visible (slightly larger now)
        while feedback ("Correct!" / "Incorrect, correct answer: XX") is
        shown above it. On "incorrect" trials, the "correct answer" shown
        is a randomly chosen emotion, guaranteed to differ from whatever
        the participant actually selected. Correct feedback triggers a
        small confetti burst (requires the canvas-confetti script to be
        loaded - see note below).
     -> every 10 trials: two 11-point (0%-100% in steps of 10) scale
        questions (jsPsych survey-likert, NOT a continuous slider)
     -> after the 10 regular blocks (100 trials), ALL participants get one
        additional, final 10-trial "bonus" block (trials 101-110) with
        100% correct feedback, regardless of their assigned condition.

   IMAGE POSITION: the face image (and, on feedback trials, the label above
   it) is rendered inside a `position: fixed` container pinned to a fixed
   distance from the top of the viewport. This makes its on-screen position
   completely independent of how jsPsych lays out or centers the rest of
   the trial content, so the image cannot visibly jump between the
   response trial (image + question + buttons) and the feedback trial
   (image + label only). An invisible spacer of matching height is kept in
   the normal document flow so the response trial's buttons/prompt render
   below the fixed image instead of underneath/behind it.

   NOTE ON DEPENDENCIES: this file assumes the canvas-confetti library is
   loaded as a global `confetti` function, e.g. via:
     <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
   in index.html. If that script is missing, feedback trials still work
   fine - the confetti call is skipped safely (see `window.confetti` check).

   Feedback is NOT drawn trial-by-trial. The full 110-trial "correct"/
   "incorrect" sequence for the participant's assigned condition is built
   ONCE, before the task starts, out of shuffled fixed-composition blocks.

   This file only DEFINES window.buildFaceTrials(jsPsych, imageList).
   It is called from experiment_mindset.js, after the mindset condition
   has already been assigned, so that the feedback condition is assigned
   independently of it (see note in experiment_mindset.js).
   ------------------------------------------------------------------------- */

window.face_trials = window.face_trials || [];

/* ---------------- task setting ---------------- */
const FACE_N_TRIALS = 110; // 100 regular trials (10 blocks of 10) + 10 bonus trials (1 block)
const FACE_TRIALS_PER_BLOCK = 10;
const FEEDBACK_DURATION_MS = 1500;
const IMAGE_DISPLAY_HEIGHT_PX = 300; // slightly larger than before (was 260px), used both during response and feedback

const EMOTION_OPTIONS = ["Sadness", "Happiness", "Anger", "Fear", "Surprise", "Disgust"];

const ITEM_QUESTIONS = [
  "Based on your first intuition, how high do you think your success rate could have been so far?",
  "Now think about the next 10 faces of the task. How high do you think your success rate will be for the next 10 faces?"
];

// 11-point scale: 0%, 10%, 20%, ..., 100%
const ITEM_SCALE_LABELS = Array.from({ length: 11 }, function (_, i) { return (i * 10) + "%"; });

// Layout constants used to keep the face image at a fixed vertical
// position across the response trial and the feedback trial (see IMAGE
// POSITION note in the file header above).
//
// The image is rendered inside a `position: fixed` container pinned to a
// fixed distance from the top of the VIEWPORT. This makes its on-screen
// position completely independent of however jsPsych lays out / centers
// the rest of the trial content (which differs between the response
// trial - image + question + buttons - and the feedback trial - image +
// label only). A `position: fixed` element ignores its parent's
// alignment entirely, so there is nothing left that can make the image
// "jump".
//
// Because the image is taken out of the normal document flow, an
// invisible spacer of matching height is still included in the normal
// flow so that the buttons/prompt (response trial) render below where
// the fixed image visually sits, instead of being overlapped by it.
const FEEDBACK_TOP_PADDING_PX = 30;
const FEEDBACK_LABEL_LINE_HEIGHT_PX = 40;
const FEEDBACK_LABEL_MARGIN_BOTTOM_PX = 20;
const FEEDBACK_LABEL_BLOCK_HEIGHT_PX = FEEDBACK_LABEL_LINE_HEIGHT_PX + FEEDBACK_LABEL_MARGIN_BOTTOM_PX;

// Total on-screen height occupied by the fixed-position block (label
// space + image), used to size the in-flow spacer so later content
// (buttons/prompt) doesn't sit underneath the fixed image.
const FIXED_BLOCK_TOTAL_HEIGHT_PX = FEEDBACK_TOP_PADDING_PX + FEEDBACK_LABEL_BLOCK_HEIGHT_PX + IMAGE_DISPLAY_HEIGHT_PX;

/* ---------------- helpers ---------------- */

// Fisher-Yates shuffle (returns a new array, does not mutate input)
function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One block of nCorrect + nIncorrect feedback labels, shuffled (used for
// 50/50 baseline blocks).
function makeFeedbackBlock(nCorrect, nIncorrect) {
  const block = Array(nCorrect).fill("correct").concat(Array(nIncorrect).fill("incorrect"));
  return shuffleArray(block);
}

// A 10-trial block built from two 5-trial halves, each containing exactly
// ONE trial with the minority label and four with the majority label
// (position of the minority trial randomized within each half). This
// guarantees an 80% majority-label rate for the block as a whole, while
// still spreading the minority trials across both halves rather than
// letting them cluster at one end (which shuffling the whole block of 10
// freely could otherwise do).
function makeHalfSplitBlock(majorityLabel) {
  const minorityLabel = majorityLabel === "correct" ? "incorrect" : "correct";
  const half1 = shuffleArray(Array(4).fill(majorityLabel).concat([minorityLabel]));
  const half2 = shuffleArray(Array(4).fill(majorityLabel).concat([minorityLabel]));
  return half1.concat(half2);
}

// Picks a random emotion from EMOTION_OPTIONS that is NOT the one the
// participant selected (used to construct the fake "correct answer" shown
// on manipulated "incorrect" feedback trials).
function pickWrongEmotion(selectedEmotion) {
  const others = EMOTION_OPTIONS.filter(function (e) { return e !== selectedEmotion; });
  return others[Math.floor(Math.random() * others.length)];
}

/* ---------------- feedback sequence construction ----------------
   Condition 1 - Baseline:          10 blocks of 10, each 5 correct/5 incorrect
   Condition 2 - Early streak/hot:  10 blocks of 10, each 80% correct (8/10)
   Condition 3 - Late streak/hot:   5 blocks (5/5) then 5 blocks (80% correct)
   Condition 4 - Late collapse/bad: 5 blocks (5/5) then 5 blocks (80% incorrect)

   All conditions then get ONE additional bonus block of 10 trials, 100%
   correct, appended at the very end (trials 101-110) - see buildFaceTrials.
------------------------------------------------------------------- */
function buildFeedbackSequence(condition) {
  let blocks = [];

  if (condition === 1) {
    for (let b = 0; b < 10; b++) blocks.push(makeFeedbackBlock(5, 5));
  } else if (condition === 2) {
    for (let b = 0; b < 10; b++) blocks.push(makeHalfSplitBlock("correct"));
  } else if (condition === 3) {
    for (let b = 0; b < 5; b++) blocks.push(makeFeedbackBlock(5, 5));
    for (let b = 0; b < 5; b++) blocks.push(makeHalfSplitBlock("correct"));
  } else if (condition === 4) {
    for (let b = 0; b < 5; b++) blocks.push(makeFeedbackBlock(5, 5));
    for (let b = 0; b < 5; b++) blocks.push(makeHalfSplitBlock("incorrect"));
  } else {
    throw new Error("Unknown feedback condition: " + condition);
  }

  // Bonus block for everyone: 10 trials, 100% correct.
  blocks.push(Array(10).fill("correct"));

  return blocks.flat();
}

/* ---------------- main builder ----------------
   Call this from experiment_mindset.js:
     window.face_trials = window.buildFaceTrials(jsPsych, faces);
   Returns an array of jsPsych trial objects ready to spread into the
   timeline. Also stamps `feedback_condition` onto all subsequent data via
   jsPsych.data.addProperties().
------------------------------------------------------------------- */
window.buildFaceTrials = function (jsPsych, imageList) {
  // Random assignment to one of 4 feedback conditions, equal (25%) probability,
  // independent of the mindset condition assigned in experiment_mindset.js.
  // NOTE: this gives each participant an equal CHANCE of landing in each of
  // the 4 feedback conditions within each mindset condition. Because there's
  // no server here to track running counts, exact equal N per cell across
  // many participants isn't guaranteed the way jsPsych.randomization's
  // sampleWithoutReplacement gives exact balance within a single run — over
  // enough participants it will even out, but if you need exact
  // counterbalancing you'd need a server-side/Qualtrics-side counter.
  const feedbackConditionLabels = {
    1: "baseline",
    2: "early_streak",
    3: "late_streak",
    4: "late_collapse"
  };
  const feedbackCondition = 1 + Math.floor(Math.random() * 4);

  jsPsych.data.addProperties({
    feedback_condition: feedbackCondition,
    feedback_condition_label: feedbackConditionLabels[feedbackCondition]
  });

  const feedbackSequence = buildFeedbackSequence(feedbackCondition);

  // Each image shown exactly once, in the order given in imageList - NOT
  // randomized (previously this was shuffled into a random order).
  let nTrials = FACE_N_TRIALS;
  if (imageList.length < FACE_N_TRIALS) {
    console.warn(
      "face_trials.js: only " + imageList.length + " face images provided, " +
      "need " + FACE_N_TRIALS + ". Running with " + imageList.length +
      " trials instead - add more images to the `faces` array before real data collection."
    );
    nTrials = imageList.length;
  }
  const trialImages = imageList.slice(0, nTrials);

  const trials = [];

  for (let i = 0; i < nTrials; i++) {
    const trialNumber = i + 1;
    const feedback = feedbackSequence[i];

    // face image + microexpression question shown together; stays on
    // screen until the participant selects a response (no trial_duration).
    // Image is shown at a reduced, fixed height so it doesn't dominate the
    // screen (width scales automatically to keep the aspect ratio).
    trials.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: (
        // invisible in-flow spacer: reserves the vertical space that the
        // fixed-position image block below visually occupies, so the
        // buttons/prompt render underneath it instead of behind it
        '<div style="height:' + FIXED_BLOCK_TOTAL_HEIGHT_PX + 'px;"></div>' +
        '<div style="position:fixed; top:' + FEEDBACK_TOP_PADDING_PX + 'px; left:50%; ' +
        'transform:translateX(-50%); display:flex; flex-direction:column; align-items:center;">' +
          // invisible spacer, same height as the feedback trial's text line,
          // so the image below sits at the exact same fixed position in both trials
          '<div style="height:' + FEEDBACK_LABEL_BLOCK_HEIGHT_PX + 'px;"></div>' +
          '<img src="' + trialImages[i] + '" style="height:' + IMAGE_DISPLAY_HEIGHT_PX + 'px; width:auto;" />' +
        '</div>'
      ),
      choices: EMOTION_OPTIONS,
      prompt: '<p style="font-size:20px;">Which of the six microexpressions did you see?</p>',
      data: { phase: "response", trial_number: trialNumber, image: trialImages[i] }
    });

    // manipulated feedback (predetermined, independent of the actual response).
    // The face image stays visible (same size) while the feedback text is
    // shown above it, centered near the top of the screen. On "incorrect"
    // trials, a fake "correct answer" is shown - a randomly chosen emotion
    // guaranteed to differ from whatever the participant actually selected.
    // On "correct" trials, a short confetti burst plays alongside the text.
    let wrongAnswerShownThisTrial = null; // set inside stimulus(), read by on_finish()

    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        const color = feedback === "correct" ? "#2e7d32" : "#c62828";
        let label;
        if (feedback === "correct") {
          label = "Correct!";
        } else {
          const lastResponse = jsPsych.data.get()
            .filter({ phase: "response", trial_number: trialNumber })
            .values()[0];
          const selectedIndex = lastResponse ? lastResponse.response : null;
          const selectedEmotion = (selectedIndex !== null && selectedIndex !== undefined)
            ? EMOTION_OPTIONS[selectedIndex]
            : null;
          wrongAnswerShownThisTrial = pickWrongEmotion(selectedEmotion);
          label = "Incorrect, correct answer: " + wrongAnswerShownThisTrial;
        }
        return (
          '<div style="position:fixed; top:' + FEEDBACK_TOP_PADDING_PX + 'px; left:50%; ' +
          'transform:translateX(-50%); display:flex; flex-direction:column; align-items:center;">' +
            '<p style="font-size:32px; line-height:' + FEEDBACK_LABEL_LINE_HEIGHT_PX + 'px; ' +
              'font-weight:bold; color:' + color + '; margin:0 0 ' + FEEDBACK_LABEL_MARGIN_BOTTOM_PX + 'px 0;">' +
              label +
            '</p>' +
            '<img src="' + trialImages[i] + '" style="height:' + IMAGE_DISPLAY_HEIGHT_PX + 'px; width:auto;" />' +
          '</div>'
        );
      },
      choices: "NO_KEYS",
      trial_duration: FEEDBACK_DURATION_MS,
      on_load: function () {
        if (feedback === "correct" && typeof window.confetti === "function") {
          window.confetti({
            particleCount: 90,
            spread: 70,
            startVelocity: 35,
            origin: { x: 0.5, y: 0.25 }
          });
        }
      },
      on_finish: function (data) {
        if (feedback === "incorrect") {
          data.feedback_correct_answer_shown = wrongAnswerShownThisTrial;
        }
      },
      data: {
        phase: "feedback",
        trial_number: trialNumber,
        feedback_shown: feedback,
        feedback_condition: feedbackCondition
      }
    });

    // every 10 trials: two 11-point scale questions (0%-100% in steps of
    // 10), using jsPsych's survey-likert plugin instead of a continuous
    // slider. Response for each is stored as an index 0-10 under Q0.
    if (trialNumber % FACE_TRIALS_PER_BLOCK === 0) {
      ITEM_QUESTIONS.forEach(function (question, qIdx) {
        trials.push({
          type: jsPsychSurveyLikert,
          questions: [
            {
              prompt: '<p style="font-size:20px;">' + question + '</p>',
              labels: ITEM_SCALE_LABELS,
              required: true
            }
          ],
          data: {
            phase: "likert",
            block_number: trialNumber / FACE_TRIALS_PER_BLOCK,
            question_index: qIdx,
            question_text: question
          }
        });
      });
    }
  }

  return trials;
};
