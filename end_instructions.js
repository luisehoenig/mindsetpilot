/* Create timeline */
window.end_instructions = window.end_instructions || [];

/* Debriefing page */
const debriefing = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Thank you for participating in this study.</p>

    <p>The purpose of this experiment was not to measure your actual ability to recognize microexpressions. 
    In fact, all of the faces shown during the task were emotionally neutral photographs and did not contain any microexpressions. 
    The feedback that you received during the experiment ("Correct" and "Incorrect") was pre-programmed and did not depend on your responses.</p>

    <p>We used this procedure because we were interested in how people form and update beliefs about their own performance when they receive positive and negative feedback over time. 
    The cover story about microexpressions and emotional intelligence was necessary because knowing the true purpose of the experiment beforehand would likely have influenced participants' expectations and learning processes, making it impossible to study these processes in a natural way.
</p>

    <p>Importantly, the feedback you received does not provide any information whatsoever about your actual ability to recognize emotions or your emotional intelligence. 
    Therefore, you should not interpret your performance in this task as an indicator of your social skills, emotional abilities, intelligence, or any personal characteristic.
</p>

    <p>If you have any questions about this study or would like additional information about its purpose or would like to withdraw your participation, please contact the corresponding researcher (luise.hoenig@univie.ac.at).</p>
  `
};

window.end_instructions.push(debriefing);

/* End page */
const end = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Thank you for your time. This experiment is now ended and you can close this tab."
};
window.end_instructions.push(end);
