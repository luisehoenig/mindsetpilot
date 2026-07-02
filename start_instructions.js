window.start_instructions = window.start_instructions || [];

const welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "Welcome to this study on detecting microexpressions!",
  choices: ["Start"]
};
window.start_instructions.push(welcome);

const consent = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p><strong>Consent Form</strong></p>
    <p>Do you agree to participate in this study?</p>
  `,
  choices: ["I agree", "I do not agree"],
  data: { task: "consent" }
};
window.start_instructions.push(consent);

/* Condition 1 */
window.instruction_condition1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>HIER TEXT FÜR CONDITION 1</p>
    <p>Press the button to start the experiment.</p>
  `,
  choices: ["Start experiment"],
  data: { task: "instruction", instruction_condition: "condition1" }
};

/* Condition 2 */
window.instruction_condition2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>HIER TEXT FÜR CONDITION 2</p>
    <p>Press the button to start the experiment.</p>
  `,
  choices: ["Start experiment"],
  data: { task: "instruction", instruction_condition: "condition2" }
};
