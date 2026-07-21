/* Load and create jsPsych */
const jsPsych = initJsPsych({
  on_finish: function() {
    console.log("Experiment finished.");
    console.log(jsPsych.data.get().values());
  }
});

const timeline = [];


/* =======================================================
   Random assignment to mindset condition
======================================================= */

const condition = jsPsych.randomization.sampleWithoutReplacement(
  ["condition1", "condition2"],
  1
)[0];

jsPsych.data.addProperties({
  condition: condition
});


/* =======================================================
   Face images
======================================================= */

const faces = [
  "img/face (1).jpg",
  "img/face (2).jpg",
  "img/face (3).jpg",
  "img/face (4).jpg",
  "img/face (5).jpg",
  "img/face (6).jpg",
  "img/face (7).jpg",
  "img/face (8).jpg",
  "img/face (9).jpg",
  "img/face (10).jpg",
  "img/face (11).jpg",
  "img/face (12).jpg",
  "img/face (13).jpg",
  "img/face (14).jpg",
  "img/face (15).jpg",
  "img/face (16).jpg",
  "img/face (17).jpg",
  "img/face (18).jpg",
  "img/face (19).jpg",
  "img/face (20).jpg",
  "img/face (21).jpg",
  "img/face (22).jpg",
  "img/face (23).jpg",
  "img/face (24).jpg",
  "img/face (25).jpg",
  "img/face (26).jpg",
  "img/face (27).jpg",
  "img/face (28).jpg",
  "img/face (29).jpg",
  "img/face (30).jpg",
  "img/face (31).jpg",
  "img/face (32).jpg",
  "img/face (33).jpg",
  "img/face (34).jpg",
  "img/face (35).jpg",
  "img/face (36).jpg",
  "img/face (37).jpg",
  "img/face (38).jpg",
  "img/face (39).jpg",
  "img/face (40).jpg",
  "img/face (41).jpg",
  "img/face (42).jpg",
  "img/face (43).jpg",
  "img/face (44).jpg",
  "img/face (45).jpg",
  "img/face (46).jpg",
  "img/face (47).jpg",
  "img/face (48).jpg",
  "img/face (49).jpg",
  "img/face (50).jpg",
  "img/face (51).jpg",
  "img/face (52).jpg",
  "img/face (53).jpg",
  "img/face (54).jpg",
  "img/face (55).jpg",
  "img/face (56).jpg",
  "img/face (57).jpg",
  "img/face (58).jpg",
  "img/face (59).jpg",
  "img/face (60).jpg",
  "img/face (61).jpg",
  "img/face (62).jpg",
  "img/face (63).jpg",
  "img/face (64).jpg",
  "img/face (65).jpg",
  "img/face (66).jpg",
  "img/face (67).jpg",
  "img/face (68).jpg",
  "img/face (69).jpg",
  "img/face (70).jpg",
  "img/face (71).jpg",
  "img/face (72).jpg",
  "img/face (73).jpg",
  "img/face (74).jpg",
  "img/face (75).jpg",
  "img/face (76).jpg",
  "img/face (77).jpg",
  "img/face (78).jpg",
  "img/face (79).jpg",
  "img/face (80).jpg",
  "img/face (81).jpg",
  "img/face (82).jpg",
  "img/face (83).jpg",
  "img/face (84).jpg",
  "img/face (85).jpg",
  "img/face (86).jpg",
  "img/face (87).jpg",
  "img/face (88).jpg",
  "img/face (89).jpg",
  "img/face (90).jpg",
  "img/face (91).jpg",
  "img/face (92).jpg",
  "img/face (93).jpg",
  "img/face (94).jpg",
  "img/face (95).jpg",
  "img/face (96).jpg",
  "img/face (97).jpg",
  "img/face (98).jpg",
  "img/face (99).jpg",
  "img/face (100).jpg",
  "img/face (101).jpg",
  "img/face (102).jpg",
  "img/face (103).jpg",
  "img/face (104).jpg",
  "img/face (105).jpg",
  "img/face (106).jpg",
  "img/face (107).jpg",
  "img/face (108).jpg",
  "img/face (109).jpg",
  "img/face (110).jpg"
];


/* =======================================================
   Preload
======================================================= */

const preload = {
  type: jsPsychPreload,
  images: faces,
  show_progress_bar: true,
  message: "Loading the experiment..."
};


/* =======================================================
   Build face trials
======================================================= */

if (typeof window.buildFaceTrials !== "function") {
  throw new Error(
    "buildFaceTrials was not found. Check whether face_trials.js loaded correctly."
  );
}

window.face_trials = window.buildFaceTrials(jsPsych, faces);


/* =======================================================
   Helper for adding modules
======================================================= */

/*
 * Adds either:
 * 1. an array of trials, or
 * 2. a single trial/timeline object.
 *
 * This avoids using the spread operator on undefined
 * or on a single jsPsych timeline object.
 */
function addModule(module, moduleName) {
  if (typeof module === "undefined" || module === null) {
    throw new Error(
      moduleName +
      " is undefined. Check the corresponding JavaScript file and variable name."
    );
  }

  if (Array.isArray(module)) {
    timeline.push(...module);
    return;
  }

  if (typeof module === "object") {
    timeline.push(module);
    return;
  }

  throw new Error(
    moduleName + " must be an array or a jsPsych trial object."
  );
}


/* =======================================================
   Create experiment timeline
======================================================= */

timeline.push(preload);

/* Welcome and consent */
addModule(
  window.start_instructions,
  "window.start_instructions"
);

/* Condition-specific instructions */
if (condition === "condition1") {
  addModule(
    window.instruction_condition1,
    "window.instruction_condition1"
  );
} else {
  addModule(
    window.instruction_condition2,
    "window.instruction_condition2"
  );
}

/* Face perception task */
addModule(
  window.face_trials,
  "window.face_trials"
);

/* End instructions */
addModule(
  window.end_instructions,
  "window.end_instructions"
);


/* =======================================================
   Run experiment
======================================================= */

jsPsych.run(timeline);
