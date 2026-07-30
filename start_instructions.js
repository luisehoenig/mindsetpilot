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


// Fixed-mindset (condition1) belief items
const emotionalIntelligenceLikertItemsFixed = [
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
      People can learn to detect emotions better, but they cannot
      really change their underlying emotional intelligence.
    `,
    name: "emotional_intelligence_fixed_2",
    required: true
  },
  {
    prompt: `
      Emotional intelligence is primarily determined by genetic
      differences.
    `,
    name: "emotional_intelligence_fixed_3",
    required: true
  },
  {
    prompt: `
      Whether someone is good at detecting microexpressions mostly
      depends on their natural abilities.
    `,
    name: "emotional_intelligence_fixed_4",
    required: true
  },
  {
    prompt: `
      A person's emotional intelligence in early childhood is a good
      indicator of their emotional intelligence later in life.
    `,
    name: "emotional_intelligence_fixed_5",
    required: true
  }
];


// Growth-mindset (condition2) belief items
const emotionalIntelligenceLikertItemsGrowth = [
  {
    prompt: `
      Everyone has a certain level of emotional intelligence, and it
      can be developed over time.
    `,
    name: "emotional_intelligence_growth_1",
    required: true
  },
  {
    prompt: `
      People can learn to detect emotions better, and in doing so,
      they can strengthen their underlying emotional intelligence.
    `,
    name: "emotional_intelligence_growth_2",
    required: true
  },
  {
    prompt: `
      Emotional intelligence can be strengthened through experience
      and practice.
    `,
    name: "emotional_intelligence_growth_3",
    required: true
  },
  {
    prompt: `
      Whether someone is good at detecting microexpressions mostly
      depends on their experiences and the effort they put into
      developing this ability.
    `,
    name: "emotional_intelligence_growth_4",
    required: true
  },
  {
    prompt: `
      A person's emotional intelligence in early childhood continues
      to develop throughout life.
    `,
    name: "emotional_intelligence_growth_5",
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
      "A subtle change in human emotional facial expression",
      "Minor inconsistencies between people's behavior and spoken words while lying",
      "Clinical symptoms of blunted affect children"
    ],

    button_layout: "grid",
    grid_columns: 1,

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


function createLikertQuestions(conditionName, items) {
  return {
    type: jsPsychSurveyLikert,

    preamble: `
      <div style="max-width: 900px; margin: 0 auto; text-align: left;">
        <p>
          Now, we want to ask you some questions about what you just read.
          If you are unsure, please check the last instructions.
        </p>
      </div>
    `,

    questions: items.map(function(item) {
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
          In this study, we are interested in how people's ability to
          perceive subtle emotional signals in human faces.
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
          People's facial expressions, even when people are trying, often
          contain very brief and subtle changes in human facial expression,
          also referred to as microexpressions.
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
          Emotional intelligence is typically measured by an EQ score, and
          people differ substantially in their level of emotional
          intelligence.
        </p>

        <p>
          Interestingly, these differences are due primarily to innate,
          genetic differences. Thus, a person's level of emotional
          intelligence becomes evident in early childhood, suggesting that
          individuals possess a relatively stable level of emotional
          potential throughout their lives.
        </p>

        <p>
          As a result, some people are naturally very good at detecting even
          subtle changes in facial microexpressions, whereas others have a
          lower innate ability to recognize such emotional cues.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Research has also investigated whether people can improve their
          ability to recognize facial microexpressions. Studies have shown
          that, with extensive and highly specialized training programs
          developed in laboratory settings, individuals may become better at
          detecting subtle emotional expressions.
        </p>

        <p>
          However, subsequent research has demonstrated that such training
          does not alter a person's underlying emotional intelligence (EQ).
          Instead, these improvements reflect only a learning effect that
          does not change the genetically determined emotional intelligence
          individuals are born with.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Taken together, research suggests that emotional intelligence is a
          key determinant of a person's ability to detect microexpressions.
          Although people may learn techniques that slightly improve their
          performance, their underlying capacity to recognize microexpressions
          remains essentially stable, as it is determined by innate, genetic
          differences.
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
    createLikertQuestions("condition1", emotionalIntelligenceLikertItemsFixed),
    createTaskInstructions("condition1"),
    createSuccessExpectationQuestion("condition1")
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
          In this study, we are interested in how people's ability to
          perceive subtle emotional signals in human faces.
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
          People's facial expressions, even when people are trying, often
          contain very brief and subtle changes in human facial expression,
          also referred to as microexpressions.
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
          Emotional intelligence is typically measured by an EQ score and
          people differ substantially in their level of emotional
          intelligence.
        </p>

        <p>
          Interestingly, emotional intelligence continues to develop
          throughout life and can be improved through experience and
          practice.
        </p>

        <p>
          As a result, people can become better at detecting even subtle
          changes in facial microexpressions by developing their emotional
          intelligence over time.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Research has investigated how people can improve their ability to
          recognize facial microexpressions. Studies have shown that
          individuals become better at detecting subtle emotional
          expressions through regular social interactions, particularly in
          small-group settings where they are motivated to pay close
          attention to others' facial expressions.
        </p>

        <p>
          In addition, subsequent laboratory research has demonstrated that
          these experiences can even strengthen a person's underlying
          emotional intelligence (EQ). As a result, researchers have
          increasingly focused on developing training programs that help
          individuals improve their ability to detect microexpressions while
          simultaneously fostering their emotional intelligence.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>
          Taken together, research suggests that emotional intelligence is a
          key determinant of a person's ability to detect microexpressions.
          Importantly, both everyday social experiences and specialized
          training can strengthen emotional intelligence over time, leading
          to lasting improvements in people's ability to recognize subtle
          emotional expressions.
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
    createLikertQuestions("condition2", emotionalIntelligenceLikertItemsGrowth),
    createTaskInstructions("condition2"),
    createSuccessExpectationQuestion("condition2")
  ]
};
