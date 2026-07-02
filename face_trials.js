/* face_trials.js
   -------------------------------------------------------------------------
   Builds the 140-trial face perception task:
     face image (5s, no repeats, full random order)
     -> single-choice microexpression response
     -> manipulated feedback (pre-generated, one of 4 between-subjects conditions)
     -> jittered fixation (1-4s, mean ~2s)
     -> every 20 trials: two 0-100 slider questions

   Feedback is NOT drawn trial-by-trial. The full 140-trial "correct"/
   "incorrect" sequence for the participant's assigned condition is built
   ONCE, before the task starts, out of shuffled fixed-composition blocks.

   This file only DEFINES window.buildFaceTrials(jsPsych, imageList).
   It is called from experiment_mindset.js, after the mindset condition
   has already been assigned, so that the feedback condition is assigned
   independently of it (see note in experiment_mindset.js).
   ------------------------------------------------------------------------- */

window.face_trials = window.face_trials || [];

/* ---------------- task settings (edit as needed) ---------------- */
const FACE_N_TRIALS = 140;
const FACE_TRIALS_PER_BLOCK = 20;
const FACE_DURATION_MS = 5000;
const FEEDBACK_DURATION_MS = 1500;
const FIXATION_MIN_S = 1;
const FIXATION_MAX_S = 4;

const EMOTION_OPTIONS = ["Sadness", "Happiness", "Anger", "Fear", "Surprise", "Disgust"];

const SLIDER_QUESTIONS = [
  "Please think about your performance so far. How high do you think your success rate has been so far?",
  "Now think about the next 10 faces of the task. How high do you think your success rate will be for the next 10 faces?"
];

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

// One block of nCorrect + nIncorrect feedback labels, shuffled
function makeFeedbackBlock(nCorrect, nIncorrect) {
  const block = Array(nCorrect).fill("correct").concat(Array(nIncorrect).fill("incorrect"));
  return shuffleArray(block);
}

// Jittered fixation duration (ms): range [1,4]s, mean ~2s.
// duration = min + (max-min) * min(U1,U2); E[min(U1,U2)] = 1/3 for
// independent Uniform(0,1) draws, so with min=1,max=4 the exact mean is
// 1 + 3*(1/3) = 2s, while every draw stays inside [1,4]s.
function sampleFixationDurationMs() {
  const r = Math.min(Math.random(), Math.random());
  const seconds = FIXATION_MIN_S + (FIXATION_MAX_S - FIXATION_MIN_S) * r;
  return Math.round(seconds * 1000);
}

/* ---------------- feedback sequence construction ----------------
   Condition 1 - Baseline:          7 blocks of 20, each 10 correct/10 incorrect
   Condition 2 - Early streak/hot:  7 blocks of 20, each 19 correct/1 incorrect
   Condition 3 - Late streak/hot:   3 blocks (10/10) then 4 blocks (19/1)
   Condition 4 - Late collapse/bad: 3 blocks (10/10) then 4 blocks (1/19)
------------------------------------------------------------------- */
function buildFeedbackSequence(condition) {
  let blocks = [];

  if (condition === 1) {
    for (let b = 0; b < 7; b++) blocks.push(makeFeedbackBlock(10, 10));
  } else if (condition === 2) {
    for (let b = 0; b < 7; b++) blocks.push(makeFeedbackBlock(19, 1));
  } else if (condition === 3) {
    for (let b = 0; b < 3; b++) blocks.push(makeFeedbackBlock(10, 10));
    for (let b = 0; b < 4; b++) blocks.push(makeFeedbackBlock(19, 1));
  } else if (condition === 4) {
    for (let b = 0; b < 3; b++) blocks.push(makeFeedbackBlock(10, 10));
    for (let b = 0; b < 4; b++) blocks.push(makeFeedbackBlock(1, 19));
  } else {
    throw new Error("Unknown feedback condition: " + condition);
  }

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

  // Randomize image order; no repeats.
  let nTrials = FACE_N_TRIALS;
  if (imageList.length < FACE_N_TRIALS) {
    console.warn(
      "face_trials.js: only " + imageList.length + " face images provided, " +
      "need " + FACE_N_TRIALS + ". Running with " + imageList.length +
      " trials instead - add more images to the `faces` array before real data collection."
    );
    nTrials = imageList.length;
  }
  const trialImages = shuffleArray(imageList).slice(0, nTrials);

  const trials = [];

  for (let i = 0; i < nTrials; i++) {
    const trialNumber = i + 1;
    const feedback = feedbackSequence[i];

    // face image, 5s, no response collected
    trials.push({
      type: jsPsychImageKeyboardResponse,
      stimulus: trialImages[i],
      choices: "NO_KEYS",
      trial_duration: FACE_DURATION_MS,
      data: { phase: "face", trial_number: trialNumber, image: trialImages[i] }
    });

    // single-choice microexpression response
    trials.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: '<p style="font-size:20px;">Which of the six microexpressions did you see?</p>',
      choices: EMOTION_OPTIONS,
      data: { phase: "response", trial_number: trialNumber }
    });

    // manipulated feedback (predetermined, independent of the actual response)
    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        const label = feedback === "correct" ? "Correct!" : "Incorrect";
        const color = feedback === "correct" ? "#2e7d32" : "#c62828";
        return '<p style="font-size:32px;font-weight:bold;color:' + color + ';">' + label + "</p>";
      },
      choices: "NO_KEYS",
      trial_duration: FEEDBACK_DURATION_MS,
      data: {
        phase: "feedback",
        trial_number: trialNumber,
        feedback_shown: feedback,
        feedback_condition: feedbackCondition
      }
    });

    // jittered fixation cross
    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div style="font-size:48px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: function () {
        return sampleFixationDurationMs();
      },
      data: { phase: "fixation", trial_number: trialNumber }
    });

    // every 20 trials: two slider questions
    if (trialNumber % FACE_TRIALS_PER_BLOCK === 0) {
      SLIDER_QUESTIONS.forEach(function (question, qIdx) {
        trials.push({
          type: jsPsychHtmlSliderResponse,
          stimulus: '<p style="font-size:20px;">' + question + "</p>",
          labels: ["0%", "100%"],
          min: 0,
          max: 100,
          slider_start: 50,
          data: {
            phase: "slider",
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
