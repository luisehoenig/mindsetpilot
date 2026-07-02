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
  "img/face (110).jpg",
  "img/face (111).jpg",
  "img/face (112).jpg",
  "img/face (113).jpg",
  "img/face (114).jpg",
  "img/face (115).jpg",
  "img/face (116).jpg",
  "img/face (117).jpg",
  "img/face (118).jpg",
  "img/face (119).jpg",
  "img/face (120).jpg",
  "img/face (121).jpg",
  "img/face (122).jpg",
  "img/face (123).jpg",
  "img/face (124).jpg",
  "img/face (125).jpg",
  "img/face (126).jpg",
  "img/face (127).jpg",
  "img/face (128).jpg",
  "img/face (129).jpg",
  "img/face (130).jpg",
  "img/face (131).jpg",
  "img/face (132).jpg",
  "img/face (133).jpg",
  "img/face (134).jpg",
  "img/face (135).jpg",
  "img/face (136).jpg",
  "img/face (137).jpg",
  "img/face (138).jpg",
  "img/face (139).jpg",
  "img/face (140).jpg"
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
