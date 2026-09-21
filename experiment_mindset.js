/* =======================================================
   Prolific integration
======================================================= */

// Shown to participants after Prolific approves ("Manually review" study
// setting) - or immediately for auto-approve studies. Update the `cc=`
// code if you ever change the study's completion code in Prolific.
const PROLIFIC_COMPLETION_URL = "https://app.prolific.com/submissions/complete?cc=C18FSNI2";

// Prolific appends these as URL query parameters when it redirects
// participants to your study link (see the {{%PROLIFIC_PID%}} etc.
// placeholders in your Prolific study URL). Reading them here lets you
// match your jsPsych data back to Prolific submissions.
const urlParams = new URLSearchParams(window.location.search);
const prolific_pid = urlParams.get("PROLIFIC_PID");
const prolific_study_id = urlParams.get("STUDY_ID");
const prolific_session_id = urlParams.get("SESSION_ID");


/* =======================================================
   Robust data saving (DataPipe -> OSF), with retries and a
   local-download fallback so a failed/blocked save never
   silently loses a participant's data.
======================================================= */

const DATAPIPE_EXPERIMENT_ID = "v8y3RnLJxTuY";
const DATAPIPE_SAVE_URL = "https://pipe.jspsych.org/api/data/";
const DATAPIPE_MAX_ATTEMPTS = 3;
const DATAPIPE_TIMEOUT_MS = 10000; // per attempt

function wait(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// Single attempt to POST data to DataPipe, with a timeout so a hung
// request can't stall the experiment indefinitely.
async function saveAttempt(filename, dataString) {
  const controller = new AbortController();
  const timeoutId = setTimeout(function () { controller.abort(); }, DATAPIPE_TIMEOUT_MS);

  try {
    const response = await fetch(DATAPIPE_SAVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
      },
      body: JSON.stringify({
        experimentID: DATAPIPE_EXPERIMENT_ID,
        filename: filename,
        data: dataString
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("DataPipe save attempt failed:", err);
    return false;
  }
}

// Retries with a short backoff (1s, 2s, ...) before giving up.
async function saveToDataPipeWithRetries(filename, dataString) {
  for (let attempt = 1; attempt <= DATAPIPE_MAX_ATTEMPTS; attempt++) {
    const ok = await saveAttempt(filename, dataString);
    if (ok) {
      console.log("DataPipe save succeeded on attempt " + attempt + ".");
      return true;
    }
    console.warn("DataPipe save attempt " + attempt + " of " + DATAPIPE_MAX_ATTEMPTS + " failed.");
    if (attempt < DATAPIPE_MAX_ATTEMPTS) {
      await wait(attempt * 1000);
    }
  }
  return false;
}

// Note: no local-download fallback here on purpose - we don't want to
// silently save a file to the participant's computer. If the final save
// fails after all retries, we just log it; the periodic per-block saves
// (see window.__saveProgressSnapshot, triggered from face_trials.js)
// mean at most the very last partial block of data would be missing on
// OSF, not the whole session.


/* Load and create jsPsych */
const jsPsych = initJsPsych({
  on_finish: function () {
    console.log("Experiment finished.");
    // Safety net only: the saving_and_redirect trial (see bottom of this
    // file) already saves the data and redirects. This just ensures the
    // participant still ends up back on Prolific even in the unlikely
    // case that trial's own redirect didn't fire.
    window.location.href = PROLIFIC_COMPLETION_URL;
  }
});

const timeline = [];

jsPsych.data.addProperties({
  prolific_pid: prolific_pid,
  prolific_study_id: prolific_study_id,
  prolific_session_id: prolific_session_id
});

// Generated early so it's stamped onto every trial's data row via
// addProperties, and so it's available to the periodic/final save logic.
const subject_id = jsPsych.randomization.randomID(10);

jsPsych.data.addProperties({
  subject_id: subject_id
});


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
   Point 1: expose a periodic "save progress so far" function
   so face_trials.js can call it after each 10-trial block.
   Fire-and-forget - not awaited by the caller, so it never
   blocks or slows down the task itself.

   IMPORTANT: DataPipe locks a filename after its first
   submission - posting to the SAME filename again does NOT
   overwrite it, the later post is silently dropped. So each
   periodic snapshot gets its OWN filename
   (`${subject_id}_progress_block${blockNumber}.csv`), separate
   from the final, complete file (`${subject_id}.csv`) saved at
   the very end. If a participant drops out mid-task, the
   highest-numbered `_progress_blockX` file for their subject_id
   is their most complete recovered data.
======================================================= */

window.__saveProgressSnapshot = function (blockNumber) {
  const filename = subject_id + "_progress_block" + blockNumber + ".csv";
  const dataString = jsPsych.data.get().csv();
  saveToDataPipeWithRetries(filename, dataString).catch(function (err) {
    console.warn("Periodic save failed unexpectedly:", err);
  });
};


/* =======================================================
   Points 2-4: final trial that
     2) shows a visible "saving..." status so participants
        don't close the tab mid-save,
     3) warns them via beforeunload if they try to close/reload
        while the save is still in progress, and
     4) shows a visible, clickable fallback link with the
        Prolific completion URL in case the automatic redirect
        doesn't fire for any reason, so the participant can
        still complete manually and get paid.
======================================================= */

const saving_and_redirect = {
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  trial_duration: null,
  stimulus: `
    <div id="save-status" style="max-width:600px; margin:80px auto; text-align:center; font-size:20px; line-height:1.5;">
      <p>Saving your data &mdash; please don't close this window...</p>
    </div>
  `,
  on_load: function () {
    const statusEl = document.getElementById("save-status");

    // Point 3: warn on close/reload attempts while the final save is
    // still in progress.
    const beforeUnloadHandler = function (e) {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);

    const filename = subject_id + ".csv";
    const dataString = jsPsych.data.get().csv();

    saveToDataPipeWithRetries(filename, dataString).then(function (saved) {
      if (!saved) {
        console.error(
          "Final DataPipe save failed after all retries for subject " + subject_id +
          ". Data collected up to the last completed block should still be on OSF " +
          "from the periodic saves, but anything after that may be missing."
        );
      }

      // Safe to navigate now - remove the warning first so our own
      // redirect below doesn't trigger the "leave site?" prompt.
      window.removeEventListener("beforeunload", beforeUnloadHandler);

      // Point 4: always show a clickable fallback link, in case the
      // automatic redirect just below doesn't fire.
      if (statusEl) {
        statusEl.innerHTML =
          "<p>Your data has been saved.</p>" +
          "<p>Redirecting you back to Prolific now...</p>" +
          "<p>If nothing happens within a few seconds, please click the link below to complete the study:</p>" +
          '<p><a href="' + PROLIFIC_COMPLETION_URL + '">' + PROLIFIC_COMPLETION_URL + "</a></p>";
      }

      window.location.href = PROLIFIC_COMPLETION_URL;
    });
  }
};

timeline.push(saving_and_redirect);


/* =======================================================
   Run experiment
======================================================= */

jsPsych.run(timeline);
