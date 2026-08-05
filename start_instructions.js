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


const informedConsentInformation = {
  type: jsPsychInstructions,
  pages: [
    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p><strong>Informed Consent</strong></p>
        <p>
          Please read the following information carefully before deciding
          whether to participate in this study. By agreeing to participate,
          you confirm that: you have understood the purpose and procedures
          of the study, you voluntarily agree to participate, and you are
          aware of your rights as a participant.
        </p>
        <p>
          Please note that you may withdraw your consent at any time
          without providing a reason. Withdrawing from the study will not
          result in any negative consequences for you. Data processing
          that has already taken place prior to your withdrawal cannot be
          reversed. For further information about your rights, please see
          the section below or contact:
          <a href="mailto:luise.hoenig@univie.ac.at">luise.hoenig@univie.ac.at</a>
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p><strong>1. Purpose and Procedure</strong></p>
        <p>
          The purpose of this study is to investigate people's ability to
          recognize facial microexpressions. During the study, you will
          complete a task in which you will identify which of six emotions
          is displayed in a series of facial microexpressions. After
          completing this task, you will be asked to answer a short
          questionnaire.
        </p>

        <p><strong>2. Benefits of Participation</strong></p>
        <p>
          Your participation will contribute to scientific research aimed
          at improving our understanding of emotion recognition and the
          factors that influence it.
        </p>

        <p><strong>3. Risks of Participation</strong></p>
        <p>
          The study involves no invasive procedures. All tasks are based
          on standardized and widely used research methods that are not
          expected to pose any risks.
        </p>
        <p>
          The study has been reviewed and approved by the Institutional
          Review Board of the Faculty of Social Sciences at the University
          of Vienna. No ethical concerns were identified that would
          restrict the use of the collected data.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p><strong>4. Additional Commitments</strong></p>
        <p>
          Participation in this study does not involve any obligations or
          consequences beyond those described above.
        </p>

        <p><strong>5. What Should You Do If You Experience Discomfort?</strong></p>
        <p>
          If you experience any discomfort, adverse effects, or other
          problems during the study, please inform the study coordinator.
          You may also contact
          <a href="mailto:luise.hoenig@univie.ac.at">luise.hoenig@univie.ac.at</a>.
        </p>

        <p><strong>6. Withdrawal from the Study</strong></p>
        <p>
          Participation in this study is entirely voluntary. You may
          withdraw your consent at any time without giving a reason and
          without any negative consequences. Upon request, the data
          collected up to the point of your withdrawal can be deleted. The
          research team will not exclude or interrupt your participation.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p><strong>7. Data Collected</strong></p>
        <p>
          The study collects demographic information such as age, gender,
          field of study, and similar background characteristics. As part
          of the study, you will participate in a task on detecting
          microexpression. At the end, you will complete questionnaires
          assessing psychological constructs.
        </p>

        <p><strong>8. Data Processing, Protection, and Storage</strong></p>
        <p>
          To protect your privacy, your data will be pseudonymized. Any
          publications resulting from this research will contain only
          pseudonymized data, meaning that individuals outside the
          research team will not be able to identify you.
        </p>
        <p>
          The data will be stored in a secure shared folder on the Open
          Science Framework. Access is restricted to authorized project
          staff and protected by passwords.
        </p>
        <p>
          In accordance with Open Science practices, pseudonymized
          research data will be stored on the University's internal
          servers for ten years. After publication of the study results,
          the pseudonymized dataset will be made publicly available
          through the Open Science Framework (OSF).
        </p>
        <p>
          This procedure follows the recommendations of the German
          Research Foundation (DFG) and the German Psychological Society
          (DGPs) regarding good scientific practice and long-term data
          archiving.
        </p>
      </div>
    `,

    `
      <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p><strong>9. Sharing of Data</strong></p>
        <p>
          Apart from the publication of pseudonymized data described
          above, your data will not be shared with third parties.
        </p>

        <p><strong>10. Compensation</strong></p>
        <p>
          Participation in this study is paid.
        </p>

        <p><strong>11. Legal Basis and Your Rights</strong></p>
        <p>
          The legal basis for processing your personal data is your
          consent in accordance with Article 6(1)(a) of the General Data
          Protection Regulation (GDPR). You may withdraw your consent at
          any time in accordance with Article 7(3) GDPR. Under the GDPR,
          you have the right to: access your personal data (Art. 15),
          object to processing (Art. 21), data portability (Art. 20),
          erasure ("right to be forgotten") (Art. 17), restriction of
          processing (Art. 18), and rectification of inaccurate data
          (Art. 16). If you wish to exercise any of these rights, please
          contact one of the study contacts listed below.
        </p>

        <p><strong>Contact:</strong></p>
        <p>
          Luise Hönig M.Sc.<br>
          <a href="mailto:luise.hoenig@univie.ac.at">luise.hoenig@univie.ac.at</a><br>
          Wächtergasse 1<br>
          1010 Vienna, Austria
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
    task: "informed_consent_information"
  }
};

window.start_instructions.push(informedConsentInformation);


const consent = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p><strong>Consent Form</strong></p>
    <p>
      I have been informed about the research project conducted by the
      Department of Motivation Psychology at the University of Vienna and
      voluntarily agree to participate. I understand and agree that the
      information I provide will be stored and analyzed by the Department
      of Motivation Psychology solely for scientific research purposes.
      After the completion of the research project, all data that could
      identify me personally will be deleted. I understand that my
      participation in this study is voluntary and that I may withdraw
      from the study at any time without providing a reason. If I choose
      to withdraw, I may also revoke the consent I have given.
    </p>
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


// Answer options for the microexpression comprehension question, shared
// between the question itself and its feedback screen (see
// createComprehensionQuestion / createComprehensionFeedback below).
const COMPREHENSION_CHOICES = [
  "A subtle change in human emotional facial expression",
  "Minor inconsistencies between people's behavior and spoken words while lying",
  "Clinical symptoms of blunted affect children"
];
const COMPREHENSION_CORRECT_INDEX = 0;


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

    choices: COMPREHENSION_CHOICES,

    button_layout: "grid",
    grid_columns: 1,

    data: {
      task: "microexpression_comprehension",
      instruction_condition: conditionName
    },

    on_finish: function(data) {
      data.correct = data.response === COMPREHENSION_CORRECT_INDEX;
    }
  };
}


// Feedback screen shown right after the comprehension question: tells the
// participant whether they were right, what they selected, and what the
// correct answer was.
function createComprehensionFeedback(conditionName) {
  return {
    type: jsPsychHtmlKeyboardResponse,

    stimulus: function() {
      const lastTrial = jsPsych.data.get()
        .filter({ task: "microexpression_comprehension", instruction_condition: conditionName })
        .last(1)
        .values()[0];

      const selectedIndex = lastTrial ? lastTrial.response : null;
      const isCorrect = selectedIndex === COMPREHENSION_CORRECT_INDEX;
      const selectedText = (selectedIndex !== null && selectedIndex !== undefined)
        ? COMPREHENSION_CHOICES[selectedIndex]
        : "(no answer recorded)";
      const correctText = COMPREHENSION_CHOICES[COMPREHENSION_CORRECT_INDEX];
      const color = isCorrect ? "#2e7d32" : "#c62828";
      const label = isCorrect ? "Correct!" : "Incorrect";

      return `
        <div style="max-width: 800px; margin: 0 auto; text-align: left;">
          <p style="font-size: 22px; font-weight: bold; color: ${color};">${label}</p>
          <p><strong>Your answer:</strong> ${selectedText}</p>
          <p><strong>Correct answer:</strong> ${correctText}</p>
          <p style="margin-top: 30px;">Press any key to continue.</p>
        </div>
      `;
    },

    data: {
      task: "microexpression_comprehension_feedback",
      instruction_condition: conditionName
    }
  };
}


function createLikertQuestions(conditionName, items) {
  return {
    type: jsPsychSurveyLikert,

    preamble: `
      <div style="max-width: 900px; margin: 0 auto; text-align: left;">
        <p>
          Next, we would like to learn more about your personal views.
          Please indicate what you personally think about the following
          statements. There are no right or wrong answers. Please respond
          as intuitively and honestly as possible.
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
            Each face contains a subtle microexpression indicating one of
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
          Recent research has provided new insights into the factors that
          influence people's ability to recognize facial microexpressions.
          Current findings suggest that the ability to read microexpressions
          and recognize subtle emotional expressions depends on a person's
          emotional intelligence. Emotional intelligence is typically
          measured by an EQ score and people differ substantially in their
          level of emotional intelligence.
        </p>

        <p>
          These differences are due primarily to innate, genetic
          differences. Thus, a person's level of emotional intelligence
          becomes evident in early childhood, suggesting that individuals
          possess a relatively stable level of emotional potential
          throughout their lives.
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
    createComprehensionFeedback("condition1"),
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
          Recent research has provided new insights into the factors that
          influence people's ability to recognize facial microexpressions.
          Current findings suggest that the ability to read microexpressions
          and recognize subtle emotional expressions depends on a person's
          emotional intelligence. Emotional intelligence is typically
          measured by an EQ score and people differ substantially in their
          level of emotional intelligence.
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
    createComprehensionFeedback("condition2"),
    condition2ManipulationInstructions,
    createLikertQuestions("condition2", emotionalIntelligenceLikertItemsGrowth),
    createTaskInstructions("condition2"),
    createSuccessExpectationQuestion("condition2")
  ]
};
