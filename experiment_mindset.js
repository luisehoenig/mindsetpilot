/* Load and create JSPsych */
const jsPsych = initJsPsych();

const timeline = [];

/* Random assignment to condition */
const condition = jsPsych.randomization.sampleWithoutReplacement(
  ["condition1", "condition2"],
  1
)[0];

/* Save condition in all data */
jsPsych.data.addProperties({
  condition: condition
});

/* Face images for the face perception task.
   NOTE: this currently lists 12 placeholder/test images - add filenames
   until you have at least 140 (one image is shown per trial, no repeats). */
const faces = [
  "img/139_32.jpg",
  "img/138_7.jpg",
  "img/137_13.jpg",
  "img/136_9.jpg",
  "img/135_28.jpg",
  "img/134_21.jpg",
  "img/133_4.jpg",
  "img/132_29.jpg",
  "img/131_6.jpg",
  "img/129_29.jpg",
  "img/128_20.jpg",
  "img/127_2.jpg"
];

const preload = {
  type: jsPsychPreload,
  images: faces
};

/* Build the 140-trial face task (see face_trials.js).
   This randomly assigns ONE of 4 feedback conditions (baseline / early
   streak / late streak / late collapse) with equal 25% probability each,
   independently of the mindset condition above - so across the 2 (mindset)
   x 4 (feedback) design, every cell has an equal chance of being filled.
   True exact counterbalancing across participants (not just equal
   probability per participant) would need a server-side running counter -
   let me know if you're deploying via Qualtrics/a backend and want that. */
window.face_trials = window.buildFaceTrials(jsPsych, faces);

/* create experiment timeline */

timeline.push(preload);
timeline.push(...window.start_instructions);

if (condition === "condition1") {
  timeline.push(window.instruction_condition1);
} else {
  timeline.push(window.instruction_condition2);
}

timeline.push(...window.face_trials);
timeline.push(...window.questionnaire_mindset);
timeline.push(...window.end_instructions);

jsPsych.run(timeline);
