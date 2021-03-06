import every        from 'lodash/every';
import isArray      from 'lodash/isArray';
import isEmpty      from 'lodash/isEmpty';
import isFunction   from 'lodash/isFunction';
import isObject     from 'lodash/isObject';
import isString     from 'lodash/isString';
import isUndefined  from 'lodash/isUndefined';
import Validator    from 'validator';
import stringParser from './stringParser';

const extraValidators = {
  /*
   * isAccepted Validation Mehod
   */
  isAccepted: (value, expected) => value === expected,

  /*
   * isAllIn Validation Method
   */
  isAllIn: (value, options) => (
    !value ? false : every(value, item => options.indexOf(item) > -1)
  )
};

/**
 * Validate a value against a validation item
 *
 * @param  any     value          Value being tested
 * @param  object  validationItem Rule set for validator
 * @return boolean                Valid?
 */
function validateAnswer(value, validationItem, questionAnswers) {
  const validationMethod = (
    !isUndefined(extraValidators[validationItem.type])
    ? extraValidators[validationItem.type]
    : (
      Validator.hasOwnProperty(validationItem.type) &&
      isFunction(Validator[validationItem.type])
    ) ? Validator[validationItem.type] : undefined
  );

  if (!validationMethod) {
    throw new Error(
      `Winterfell: Attempted to validate for undefined method "${validationItem.type}"`
    );
  }

  /*
   * Clone the validation parameters so it doesn't effect the
   * parameters elsewhere by reference.
   */
  let validationParameters = (validationItem.params || []).slice(0);

  /*
   * Run the parameters through the stringParser with the
   * questionAnswers so that it sets the questionAnswer
   * as the parameter.
   */
  validationParameters = validationParameters.map(parameter => (
    isString(parameter) ? stringParser(parameter, questionAnswers) : parameter
  ));

  /*
   * Push the value of the question we're validating to
   * the first parameter of the validationParameters
   */
  validationParameters.unshift(value);

  /*
   * Return the result of the validation method running
   * wtih the validationParameters.
   */
  return validationMethod.apply(null, validationParameters);
};

/**
 * Get active questions from an array of questions,
 * recursively. Follows active conditions.
 *
 * @param  array  questions       Questions to run through
 * @param  object questionAnswers Current answers for questions
 * @param  array  activeQuestions
 * @return array                  All active questions
 */
function getActiveQuestions(questions, questionAnswers, activeQuestions) {
  activeQuestions = activeQuestions || [];

  questions
  .forEach(question => {
    activeQuestions.push({
      questionId:  question.questionId,
      validations: question.validations
    });

    if (isUndefined(question.input.options) || isEmpty(question.input.options)) {
      return;
    }

    question
    .input
    .options
    .forEach(option => {
      if (
        isUndefined(option.conditionalQuestions) ||
        isEmpty(option.conditionalQuestions) ||
        questionAnswers[question.questionId] !== option.value
      ) { return; }

      activeQuestions = getActiveQuestions(
        option.conditionalQuestions,
        questionAnswers,
        activeQuestions
      );
    });
  });

  return activeQuestions;
};

/**
 * Get active questions from multiple question sets
 *
 * @param  array  questionSets    All question sets
 * @param  object questionAnswers Current answers for questions
 * @return array                  All active questions
 */
function getActiveQuestionsFromQuestionSets(questionSets, questionAnswers) {
  const questionsToCheck = [];

  questionSets
  .forEach(questionSet => Array.prototype.push.apply(
    questionsToCheck,
    getActiveQuestions(questionSet.questions, questionAnswers)
  ));

  return questionsToCheck;
};

/**
 * Get all invalid questions from question sets
 *
 * @param  array  questionSets     All question sets
 * @param  object questionAnswers  Current answers for questions
 * @return object                  Set of questions and their invalidations
 */
function getQuestionPanelInvalidQuestions(questionSets, questionAnswers) {
  const questionsToCheck = (
    getActiveQuestionsFromQuestionSets(questionSets, questionAnswers)
    .filter(question => isArray(question.validations) && !isEmpty(question.validations))
  );

  /*
   * Now we run validations for the questions
   * we need to check for errors.
   *
   * Go through every question, and its validations
   * then run the question and answer through
   * the validation method required.
   */
  const errors = {};

  questionsToCheck.forEach(({questionId, validations}) => {
    validations.forEach(validation => {
      const valid = validateAnswer(
        questionAnswers[questionId],
        validation,
        questionAnswers
      );

      if (valid) { return; }

      /*
       * If we got here, the validation failed. Add
       * an validation error and continue to the next!
       */
      if (isUndefined(errors[questionId])) {
        errors[questionId] = [];
      }

      errors[questionId].push(validation);
    }, this);
  }, this);

  return errors;
};

/**
 * Add a single validation method
 *
 * @param  string   name   Name of validation method
 * @param  function method Validation method
 */
function addValidationMethod(name, method) {
  if (!isString(name)) {
    throw new Error(
      'Winterfell: First parameter of addValidationMethod must be of type string'
    );
  }

  if (!isFunction(method)) {
    throw new Error(
      'Winterfell: Second parameter of addValidationMethod must be of type function'
    );
  }

  extraValidators[name] = method;
};

/**
 * Add multiple validation methods
 *
 * @param  array methods Methods to add. name => func
 */
function addValidationMethods(methods) {
  if (!isObject(methods)) {
    throw new Error(
      'Winterfell: First parameter of addValidationMethods must be of type object'
    );
  }

  for (let methodName in methods) {
    addValidationMethod(methodName, methods[methodName]);
  }
};

const actions = {
  validateAnswer,
  getActiveQuestions,
  getActiveQuestionsFromQuestionSets,
  getQuestionPanelInvalidQuestions,
  addValidationMethod,
  addValidationMethods
};

export default actions;
