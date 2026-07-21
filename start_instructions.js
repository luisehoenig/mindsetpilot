window.start_instructions = window.start_instructions || [];


/* =======================================================
   Welcome and consent
======================================================= */

const welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Welcome to this study on detecting microexpressions!</p>
  `,
  choices: ["Start"],
  data: {
    task: "welcome"
  }
};

window.start_instructions.push(welcome);


const consent = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p><strong>Consent Form</strong></p>
    <p>Do you agree to participate in this study?</p>
  `,
  choices: ["I agree", "I do not agree"],
  data: {
    task: "consent"
  }
};

window.start_instructions.push(consent);


/* =======================================================
   Shared variables
======================================================= */

const emotionalIntelligenceLikertScale = [
  "Completely agree",
  "Agree",
  "Somewhat agree",
  "Neither agree nor disagree",
  "Somewhat disagree",
  "Disagree",
  "Completely disagree"
];


const emotionalIntelligenceLikertItems = [
  {
    prompt: `
      Everybody has a certain amount of emotional intelligence,
      and one can't really do much to change it.
    `,
    name: "emotional_intelligence_fixed_1",
    required: true
  },
  {
    prompt: `
      Your emotional intelligence is something about you
      that you can't change very much.
    `,
    name: "emotional_intelligence_fixed_2",
    required: true
  },
  {
    prompt: `
      You can learn to detect emotions, but you can't really
      change your basic emotional intelligence.
    `,
    name: "emotional_intelligence_fixed_3",
    required: true
  }
];


/* =======================================================
   Shared helper functions
======================================================= */

function createComprehensionQuestion(conditionName) {
  return {
    type: jsPsychHtmlButtonResponse,

    stimulus: `
      <div style="max-width: 800px; margin: 0 auto;">
        <p><strong>What is a microexpression?</strong></p>
        <p>Please select the correct answer.</p>
      </div>
    `,

    choices: [
      "A subtle change in human emotional mimic",
      "Minor inconsistencies between people's behavior and spoken words while lying",
      "Clinical symptoms of blunted affect in children"
    ],

    data: {
      task: "microexpression_comprehension",
      instruction_condition: conditionName,
      correct_response: 0
    },

    on_finish: function(data) {
      data.correct = data.response === 0;
    }
  };
}


function createLikertQuestions(conditionName) {
  return {
    type: jsPsychSurveyLikert,

    preamble: `
      <div style="max-width: 900px; margin: 0 auto; text-align: left;">
        <p>
          Now, we want to ask you some questions about what you just read.
        </p>

        <p>
          Please indicate how strongly you agree or disagree with each
          statement.
        </p>
      </div>
    `,

    questions: emotionalIntelligenceLikertItems.map(function(item) {
      return {
        prompt: item.prompt,
        name: item.name,
        labels: emotionalIntelligenceLikertScale,
        required: item.required
      };
    }),

    button_label: "Continue",

    data: {
      task: "emotional_intelligence_likert",
      instruction_condition: conditionName
    }
  };
}


function createSuccessExpectationQuestion(conditionName) {
  return {
    type: jsPsychSurveyHtmlForm,

    preamble: `
      <div style="max-width: 800px; margin: 0 auto;">
        <p>
          <strong>
            Before starting the task, we would like to know your initial
            expectation.
          </strong>
        </p>

        <p>
          How high do you think your success rate in this task will be?
        </p>

        <p>
          Please indicate the percentage of faces that you think you will
          identify correctly.
        </p>
      </div>
    `,

    html: `
      <div style="margin: 30px 0;">
        <label for="expected_success_rate">
          Expected success rate:
        </label>

        <input
          type="number"
          id="expected_success_rate"
          name="expected_success_rate"
          min="0"
          max="100"
          step="1"
          required
          style="
            width: 90px;
            margin-left: 10px;
            padding: 6px;
            font-size: 16px;
          "
        >

        <span style="margin-left: 5px;">%</span>
      </div>
    `,

    button_label: "Continue",

    data: {
      task: "expected_success_rate",
      instruction_condition: conditionName
    },

    on_finish: function(data) {
      data.expected_success_rate = Number(
        data.response.expected_success_rate
      );
    }
  };
}


function createTaskInstructions(conditionName) {
  return {
    type: jsPsychInstructions,

    pages: [
      `
        <div style="max-width: 800px; margin: 0 auto; text-align: left;">
          <p>
            In the following task, you will be presented with a series of
            faces.
          </p>

          <p>
            Each face may contain a subtle microexpression indicating one of
            six possible emotions.
          </p>

          <p>
            Please look at each face carefully. After each face, you will see
            six possible emotions:
          </p>

          <ul>
            <li>Sadness</li>
            <li>Happiness</li>
            <li>Anger</li>
            <li>Fear</li>
            <li>Surprise</li>
            <li>Disgust</li>
          </ul>
        </div>
      `,

      `
        <div style="max-width: 800px; margin: 0 auto; text-align: left;">
          <p>
            Your task is to choose the emotion that you believe was expressed
            in the face.
          </p>

          <p>
            Some faces may be easier to judge than others. Please rely on your
            intuition and provide your best answer on every trial.
          </p>

          <p>
            After each response, you will receive feedback indicating whether
            your answer was correct or incorrect.
          </p>
        </div>
      `
    ],

    show_clickable_nav: true,
    allow_backward: true,
    show_page_number: true,

    button_label_previous: "Back",
    button_label_next: "Start experiment",

    data: {
      task: "task_instructions",
      instruction_condition: conditionName
    }
  };
}


/* =======================================================
   Condition 1
   Fixed / innate emotional intelligence
======================================================= */

const condition1GeneralInstructions = {
  type: jsPsychInstructions,

  pages: [
    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          In this study, we are interested in people's ability to perceive
          subtle emotional signals in human faces.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Research suggests that even when people try not to express their
          emotions, their emotions cause very brief and subtle changes in
          their facial expressions.
        </p>

        <p>
          These changes are called microexpressions.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          People's facial expressions, even when people are trying not to
          display their emotions, often contain very brief and subtle changes
          in human mimic, also referred to as microexpressions.
        </p>

        <p>
          These expressions can occur very quickly and may provide information
          about a person's emotional state, even when the expression is
          difficult to detect consciously.
        </p>
      </div>
    `
  ],

  show_clickable_nav: true,
  allow_backward: true,
  show_page_number: true,

  button_label_previous: "Back",
  button_label_next: "Continue",

  data: {
    task: "general_instructions",
    instruction_condition: "condition1"
  }
};


const condition1ManipulationInstructions = {
  type: jsPsychInstructions,

  pages: [
    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          The ability to read microexpressions and recognize subtle emotional
          expressions depends on a person's emotional intelligence.
        </p>

        <p>
          Emotional intelligence is typically measured by an EQ score, and
          people differ substantially in their level of emotional intelligence.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Interestingly, these differences are due primarily to innate,
          genetic differences.
        </p>

        <p>
          Thus, a person's level of emotional intelligence becomes evident in
          early childhood, suggesting that individuals possess a relatively
          stable level of emotional potential throughout their lives.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          As a result, some people are naturally very good at detecting even
          subtle changes in facial microexpressions, whereas others have a
          lower innate ability to recognize such emotional cues.
        </p>
      </div>
    `
  ],

  show_clickable_nav: true,
  allow_backward: true,
  show_page_number: true,

  button_label_previous: "Back",
  button_label_next: "Continue",

  data: {
    task: "condition_manipulation",
    instruction_condition: "condition1",
    mindset_condition: "fixed"
  }
};


window.instruction_condition1 = {
  timeline: [
    condition1GeneralInstructions,
    createComprehensionQuestion("condition1"),
    condition1ManipulationInstructions,
    createLikertQuestions("condition1"),
    createSuccessExpectationQuestion("condition1"),
    createTaskInstructions("condition1")
  ]
};


/* =======================================================
   Condition 2
   Developable emotional intelligence
======================================================= */

const condition2GeneralInstructions = {
  type: jsPsychInstructions,

  pages: [
    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          In this study, we are interested in people's ability to perceive
          subtle emotional signals in human faces.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Research suggests that even when people try not to express their
          emotions, their emotions cause very brief and subtle changes in
          their facial expressions.
        </p>

        <p>
          These changes are called microexpressions.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          People's facial expressions, even when people are trying not to
          display their emotions, often contain very brief and subtle changes
          in human mimic, also referred to as microexpressions.
        </p>

        <p>
          These expressions can occur very quickly and may provide information
          about a person's emotional state, even when the expression is
          difficult to detect consciously.
        </p>
      </div>
    `
  ],

  show_clickable_nav: true,
  allow_backward: true,
  show_page_number: true,

  button_label_previous: "Back",
  button_label_next: "Continue",

  data: {
    task: "general_instructions",
    instruction_condition: "condition2"
  }
};


const condition2ManipulationInstructions = {
  type: jsPsychInstructions,

  pages: [
    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          The ability to read microexpressions and recognize subtle emotional
          expressions depends on a person's emotional intelligence.
        </p>

        <p>
          Emotional intelligence is typically measured by an EQ score, and
          people differ substantially in their level of emotional intelligence.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Interestingly, emotional intelligence continues to develop
          throughout life and can be improved through experience and practice.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          As a result, people can become better at detecting even subtle
          changes in facial microexpressions by developing their emotional
          intelligence over time.
        </p>
      </div>
    `
  ],

  show_clickable_nav: true,
  allow_backward: true,
  show_page_number: true,

  button_label_previous: "Back",
  button_label_next: "Continue",

  data: {
    task: "condition_manipulation",
    instruction_condition: "condition2",
    mindset_condition: "growth"
  }
};


window.instruction_condition2 = {
  timeline: [
    condition2GeneralInstructions,
    createComprehensionQuestion("condition2"),
    condition2ManipulationInstructions,
    createLikertQuestions("condition2"),
    createSuccessExpectationQuestion("condition2"),
    createTaskInstructions("condition2")
  ]
};
