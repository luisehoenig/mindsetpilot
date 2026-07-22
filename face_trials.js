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
     -> a thin progress bar fixed to the top of the page runs throughout
        the 110 face trials. Its fill level is an EXPONENTIALLY SMOOTHED
        (EMA) running average of the correct/incorrect feedback, NOT the
        raw/cumulative rate and NOT a plain N-trial window - this avoids
        any sharp visual jumps at the exact 10-trial block boundaries that
        would otherwise hint that feedback is pre-scripted. It shows only
        a colored fill (no percentage number), and is hidden during the
        two item questions every 10 trials, and outside the face task
        entirely (instructions, debriefing, etc.).
     -> every 10 trials: two 11-point (0%-100% in steps of 10) scale
        questions (jsPsych survey-likert, NOT a continuous slider)
     -> after the 10 regular blocks (100 trials), ALL participants get one
        additional, final 10-trial "bonus" block (trials 101-110) with
        100% correct feedback, regardless of their assigned condition.

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
  "Please think about your performance so far. How high do you think your success rate has been so far?",
  "Now think about the next 10 faces of the task. How high do you think your success rate will be for the next 10 faces?"
];

// 11-point scale: 0%, 10%, 20%, ..., 100%
const ITEM_SCALE_LABELS = Array.from({ length: 11 }, function (_, i) { return (i * 10) + "%"; });

// EMA smoothing constant for the progress bar. alpha = 2 / (N + 1) gives a
// smoothing "span" roughly comparable to an N-trial moving average, but
// without the hard edges of a fixed window (no old trial "drops out"
// abruptly - every past trial just fades out gradually). N=14 matches the
// window size originally discussed.
const PROGRESS_BAR_EMA_ALPHA = 2 / (14 + 1);
const PROGRESS_BAR_START_VALUE = 0.5; // neutral starting fill (50%), before any feedback exists

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

/* ---------------- progress bar helpers ----------------
   A thin bar fixed to the top of the page, created once and appended
   directly to document.body (i.e. OUTSIDE jsPsych's own display element,
   which gets wiped/rebuilt on every trial). It is hidden by default and
   only shown/hidden via explicit calls from the trial callbacks below, so
   it never appears during instructions, the two item questions, or the
   debriefing/end screens.
------------------------------------------------------------------- */
function ensureProgressBarElement() {
  let container = document.getElementById("face-progress-bar-container");
  if (container) return container;

  container = document.createElement("div");
  container.id = "face-progress-bar-container";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "8px";
  container.style.backgroundColor = "#e0e0e0";
  container.style.zIndex = "9999";
  container.style.display = "none"; // hidden until explicitly shown

  const fill = document.createElement("div");
  fill.id = "face-progress-bar-fill";
  fill.style.height = "100%";
  fill.style.width = (PROGRESS_BAR_START_VALUE * 100) + "%";
  fill.style.backgroundColor = "hsl(" + (PROGRESS_BAR_START_VALUE * 120) + ", 70%, 45%)";
  fill.style.transition = "width 0.6s ease, background-color 0.6s ease";

  container.appendChild(fill);
  document.body.appendChild(container);
  return container;
}

function showProgressBar() {
  ensureProgressBarElement().style.display = "block";
}

function hideProgressBar() {
  ensureProgressBarElement().style.display = "none";
}

// value: number in [0, 1]. Updates fill width and a red-to-green hue.
function updateProgressBar(value) {
  const fill = document.getElementById("face-progress-bar-fill");
  if (!fill) return;
  const clamped = Math.max(0, Math.min(1, value));
  fill.style.width = (clamped * 100) + "%";
  fill.style.backgroundColor = "hsl(" + (clamped * 120) + ", 70%, 45%)";
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

  // Running EMA value for the progress bar, updated after every feedback trial.
  let progressBarEma = PROGRESS_BAR_START_VALUE;

  const trials = [];

  for (let i = 0; i < nTrials; i++) {
    const trialNumber = i + 1;
    const feedback = feedbackSequence[i];

    // face image + microexpression question shown together; stays on
    // screen until the participant selects a response (no trial_duration).
    // Image is shown at a reduced, fixed height so it doesn't dominate the
    // screen (width scales automatically to keep the aspect ratio).
    trials.push({
      type: jsPsychImageButtonResponse,
      stimulus: trialImages[i],
      stimulus_height: IMAGE_DISPLAY_HEIGHT_PX,
      maintain_aspect_ratio: true,
      choices: EMOTION_OPTIONS,
      prompt: '<p style="font-size:20px;">Which of the six microexpressions did you see?</p>',
      on_start: function () {
        showProgressBar();
      },
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
          '<div style="display:flex; flex-direction:column; align-items:center; ' +
          'justify-content:flex-start; padding-top:30px;">' +
            '<p style="font-size:32px; font-weight:bold; color:' + color + '; margin:0 0 20px 0;">' +
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

        // Update the EMA progress bar. This is a smoothed running average,
        // not the raw/cumulative correct rate - see the file header note.
        const outcome = feedback === "correct" ? 1 : 0;
        progressBarEma = PROGRESS_BAR_EMA_ALPHA * outcome + (1 - PROGRESS_BAR_EMA_ALPHA) * progressBarEma;
        updateProgressBar(progressBarEma);
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
    // The progress bar is hidden during these two questions.
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
          on_start: function () {
            hideProgressBar();
          },
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
