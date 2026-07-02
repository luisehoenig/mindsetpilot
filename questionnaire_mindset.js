/* Create timeline */
window.questionnaire_mindset = window.questionnaire_mindset || [];

/* Create items */
const questionnaire_instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p><strong>Questionnaire</strong></p>

    <p>Great, you completed the face perception task.</p>
    <p>We would now like you to complete a short questionnaire about your thoughts and beliefs. There are no right or wrong answers. 
    Please answer all questions as honestly as possible.</p>

    <p>Press any key to begin!</p>
  `
};

window.questionnaire_mindset.push(questionnaire_instruction);

const likert_scale = ["strongly agree", "agree", "mostly agree", "mostly disagree", "disagree", "strongly disagree"];

const item1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "You have a certain amount of intelligence, and you can't really do much to change it.",
  choices: likert_scale,
  data: {
  task: "mindset",
  question: "item1"
}
};

window.questionnaire_mindset.push(item1);

const item2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "Your intelligence is something about you that you can't change very much.",
  choices: likert_scale,
  data: {
  task: "mindset",
  question: "item2"
}
};

window.questionnaire_mindset.push(item2);

const item3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "You can learn new things, but you can't really change your basic intelligence.",
  choices: likert_scale,
  data: {
  task: "mindset",
  question: "item3"
}
};

window.questionnaire_mindset.push(item3);
