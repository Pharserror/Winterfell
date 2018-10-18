import isEmpty              from 'lodash/isEmpty';
import isFunction           from 'lodash/isFunction';
import isObject             from 'lodash/isObject';
import isUndefined          from 'lodash/isUndefined';
import React, { Component } from 'react';
import InputTypes           from './inputTypes';

export default class Question extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this, this.props.questionId);
    this.handleInputBlur = this.handleInputBlur.bind(this, this.props.questionId);
  }

  handleInputChange(event, value) {
    this.props.onAnswerChange(
      this.props.questionId,
      value,
      this.props.validations,
      this.props.validateOn
    );
  }

  handleInputBlur(event, value) {
    this.props.onQuestionBlur(
      this.props.questionId,
      value,
      this.props.validations,
      this.props.validateOn
    );
  }

  render() {
    let Input = InputTypes[this.props.input.type];

    if (!Input) {
      throw new Error(
        `Winterfell: Input Type "${this.props.input.type}" not defined as Winterfell Input Type`
      );
    }

    /*
     * Conditional Questions
     *
     * Go through the inputs options and filter them down
     * to options where the value matches the current questions
     * value. If we have conditional questions on a given option,
     * then render this component with the props for the conditional
     * question.
     */
    let conditionalItems = [];

    if (!isUndefined(this.props.input.options)) {
      this.props.input.options
      .filter(option => (
        this.props.value instanceof Array
        ? this.props.value.indexOf(option.value) > -1
        : this.props.value === option.value
      ))
      .filter(option => (
        !isUndefined(option.conditionalQuestions) &&
        !isEmpty(option.conditionalQuestions)
      ))
      .forEach(option => (
        option.conditionalQuestions.forEach(conditionalQuestion => {
          conditionalItems.push(
            <Question
              classes={this.props.classes}
              input={conditionalQuestion.input}
              key={conditionalQuestion.questionId}
              postText={conditionalQuestion.postText}
              question={conditionalQuestion.question}
              questionAnswers={this.props.questionAnswers}
              questionId={conditionalQuestion.questionId}
              questionSetId={this.props.questionSetId}
              onAnswerChange={this.props.onAnswerChange}
              onKeyDown={this.props.onKeyDown}
              onQuestionBlur={this.props.onQuestionBlur}
              renderError={this.props.renderError}
              text={conditionalQuestion.text}
              validateOn={conditionalQuestion.validateOn}
              validationErrors={this.props.validationErrors}
              validations={conditionalQuestion.validations}
              value={this.props.questionAnswers[conditionalQuestion.questionId]}
            />
          );
        }, this)
      ));
    }

    // Get the current value. If none is set, then use
    // the default if given.
    let value = (
      !isUndefined(this.props.value)
      ? this.props.value
      : !isUndefined(this.props.input.default)
      ? this.props.input.default
      : undefined
    );

    // Retrieve the validation errors for the
    // current question and map them in to
    // error-message blocks.
    let validationErrors = (
      !isUndefined(this.props.validationErrors[this.props.questionId])
      ? (
        this.props.validationErrors[this.props.questionId]
        .map(error => (
          isFunction(this.props.renderError)
          ? this.props.renderError(error, this.props.questionId)
          : (
            <div
              key={`${this.props.questionId} Error ${error.type}`}
              className={this.props.classes.errorMessage}
            >
              {error.message}
            </div>
          )
        ))
      ) : []
    );

    let labelId = `${this.props.questionId}-label`;

    return (
      <div className={this.props.classes.question}>
        {
          !!this.props.question
          ? (
            <label
              className={this.props.classes.label}
              id={labelId}
              htmlFor={this.props.questionId}
            >
              {this.props.question}
              {
                !isUndefined(this.props.renderRequiredAsterisk) &&
                this.props.input.required
                ? this.props.renderRequiredAsterisk()
                : null
              }
            </label>
          ) : null
        }
        {
          !!this.props.text
          ? (
              <p className={this.props.classes.questionText}>
                {this.props.text}
              </p>
          ) : null
        }
        {validationErrors}
        <Input
          name={this.props.questionId}
          id={this.props.questionId}
          labelId={labelId}
          value={value}
          text={this.props.input.text}
          options={this.props.input.options}
          placeholder={this.props.input.placeholder}
          required={this.props.input.required}
          classes={this.props.classes}
          onChange={this.handleInputChange}
          onBlur={this.handleInputBlur}
          onKeyDown={this.props.onKeyDown}
          {...(isObject(this.props.input.props) ? this.props.input.props : {})}
        />
        {
          !!this.props.postText
          ? (
            <p className={this.props.classes.questionPostText}>
              {this.props.postText}
            </p>
          ) : undefined
        }
        {conditionalItems}
      </div>
    );
  }

  componentDidMount() {
    if (
      isUndefined(this.props.input.default) || (
        this.props.input.type === 'checkboxInput' &&
        isUndefined(this.props.questionAnswers[this.props.questionId])
      )
    ) { return; }

    this.handleInputChange(undefined, this.props.input.default);
  }

};

Question.defaultProps = {
  classes:                {},
  input: {
    default:     undefined,
    type:        'textInput',
    limit:       undefined,
    placeholder: undefined
  },
  onAnswerChange:         () => {},
  onKeyDown:              () => {},
  onQuestionBlur:         () => {},
  postText:               undefined,
  question:               '',
  questionAnswers:        {},
  questionId:             undefined,
  questionSetId:          undefined,
  renderError:            undefined,
  renderRequiredAsterisk: undefined,
  text:                   undefined,
  validationErrors:       {},
  validateOn:             'blur',
  validations:            [],
  value:                  undefined
};
