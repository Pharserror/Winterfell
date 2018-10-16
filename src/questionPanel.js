import cloneDeep            from 'lodash/cloneDeep';
import filter               from 'lodash/filter';
import find                 from 'lodash/find';
import isEmpty              from 'lodash/isEmpty';
import isUndefined          from 'lodash/isUndefined';
import mapValues            from 'lodash/mapValues';
import set                  from 'lodash/set';
import React, { Component } from 'react';
import KeyCodez             from 'keycodez';
import Button               from './button';
import ErrorMessages        from './lib/errors';
import Validation           from './lib/validation';
import QuestionSet          from './questionSet';

export default class QuestionPanel extends Component {
  constructor(props) {
    super(props);

    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleMainButtonClick = this.handleMainButtonClick.bind(this);
    this.handleQuestionBlur = this.handleQuestionBlur.bind(this);
    this.questionSets = this.questionSets.bind(this);
    this.state = {
      validationErrors : this.props.validationErrors
    };
  }

  handleAnswerValidate(questionId, questionAnswer, validations) {
    if (isUndefined(validations) || isEmpty(validations)) { return; }
    /*
     * Run the question through its validations and
     * show any error messages if invalid.
     */
    const questionValidationErrors = [];

    validations
    .forEach(validation => {
      if (
        Validation.validateAnswer(
          questionAnswer,
          validation,
          this.props.questionAnswers
        )
      ) { return; }

      questionValidationErrors.push({
        type:    validation.type,
        message: ErrorMessages.getErrorMessage(validation)
      });
    });

    const validationErrors = set(
      cloneDeep(this.state.validationErrors),
      questionId,
      questionValidationErrors
    );

    this.setState({ validationErrors });
  }

  handleMainButtonClick() {
    let action = this.props.action.default;
    const conditions = this.props.action.conditions || [];

    /*
     * We need to get all the question sets for this panel.
     * Collate a list of the question set IDs required
     * and run through the schema to grab the question sets.
     */
    const questionSetIds = this.props.questionSets.map(
      questionSet => questionSet.questionSetId
    );

    const questionSets = filter(
      this.props.schema.questionSets,
      questionSet => questionSetIds.indexOf(questionSet.questionSetId) > -1
    );

    /*
     * Get any incorrect fields that need error messages.
     */
    const invalidQuestions = Validation.getQuestionPanelInvalidQuestions(
      questionSets,
      this.props.questionAnswers
    );

    /*
     * If the panel isn't valid...
     */
    if (isEmpty(Object.keys(invalidQuestions))) {
      const validationErrors = mapValues(invalidQuestions, validations => (
        validations.map(validation => ({
          type:    validation.type,
          message: ErrorMessages.getErrorMessage(validation)
        }))
      ));

      this.setState({ validationErrors });
      return;
    }

    /*
     * Panel is valid. So what do we do next?
     * Check our conditions and act upon them, or the default.
     */
    conditions.forEach(condition => {
      const answer = this.props.questionAnswers[condition.questionId];
      action = (
        answer == condition.value
        ? {
          action : condition.action,
          target : condition.target
        } : action
      );
    });

    /*
     * Decide which action to take depending on
     * the action decided upon.
     */
    switch (action.action) {
      case 'GOTO': {
        this.props.onSwitchPanel(action.target);
        break;
      }
      case 'SUBMIT': {
        this.props.onSubmit(action.target);
        break;
      }
      default: {
        break;
      }
    }
  }

  handleBackButtonClick(_event) {
    if (isEmpty(this.props.panelHistory)) { return; }
    this.props.onPanelBack();
  }

  handleAnswerChange(questionId, questionAnswer, validations, validateOn) {
    this.props.onAnswerChange(questionId, questionAnswer);

    this.setState({
      validationErrors: set(cloneDeep(this.state.validationErrors), questionId, [])
    });

    if (validateOn === 'change') {
      this.handleAnswerValidate(questionId, questionAnswer, validations);
    }
  }

  handleQuestionBlur(questionId, questionAnswer, validations, validateOn) {
    if (validateOn === 'blur') {
      this.handleAnswerValidate(questionId, questionAnswer, validations);
    }
  }

  handleInputKeyDown(event) {
    if (KeyCodez[event.keyCode] === 'enter') {
      event.preventDefault();
      this.handleMainButtonClick();
    }
  }

  questionSets() {
    return (
      this.props.questionSets.map(questionSetMeta => {
        const questionSet = find(
          this.props.schema.questionSets,
          { questionSetId : questionSetMeta.questionSetId }
        );

        if (!questionSet) { return null; }

        return (
          <QuestionSet
            classes={this.props.classes}
            id={questionSet.questionSetId}
            key={questionSet.questionSetId}
            name={questionSet.name}
            onAnswerChange={this.handleAnswerChange}
            onKeyDown={this.handleInputKeyDown.bind(this)}
            onQuestionBlur={this.handleQuestionBlur}
            questionAnswers={this.props.questionAnswers}
            questions={questionSet.questions}
            questionSetHeader={questionSet.questionSetHeader}
            questionSetText={questionSet.questionSetText}
            renderError={this.props.renderError}
            renderRequiredAsterisk={this.props.renderRequiredAsterisk}
            validationErrors={this.state.validationErrors}
          />
        );
      })
    );
  }

  render() {
    return (
      <div className={this.props.classes.questionPanel}>
        {
          !isUndefined(this.props.panelHeader) || !isUndefined(this.props.panelText)
          ? (
            <div className={this.props.classes.questionPanelHeaderContainer}>
              {
                !isUndefined(this.props.panelHeader)
                ? (
                  <h3 className={this.props.classes.questionPanelHeaderText}>
                    {this.props.panelHeader}
                  </h3>
                ) : null
              }
              {
                !isUndefined(this.props.panelText)
                ? (
                  <p className={this.props.classes.questionPanelText}>
                    {this.props.panelText}
                  </p>
                ) : null
              }
            </div>
          ) : null
        }
        <div className={this.props.classes.questionSets}>
          {this.questionSets()}
        </div>
        <div className={this.props.classes.buttonBar}>
          {
            (this.props.panelHistory.length > 1 && !this.props.backButton.disabled)
            ? (
              <Button
                text={this.props.backButton.text || 'Back'}
                onClick={this.handleBackButtonClick}
                className={this.props.classes.backButton}
              />
            ) : null
          }
          {
            !this.props.button.disabled
            ? (
              <Button
                text={this.props.button.text}
                onClick={this.handleMainButtonClick}
                className={this.props.classes.controlButton}
              />
            ) : null
          }
        </div>
      </div>
    );
  }
};

QuestionPanel.defaultProps = {
  action: {
    default:    {},
    conditions: []
  },
  backButton:             { text: 'Back' },
  button:                 { text: 'Submit' },
  classes:                {},
  panelHeader:            undefined,
  panelId:                undefined,
  panelIndex:             undefined,
  panelText:              undefined,
  questionAnswers:        {},
  questionSets:           [],
  renderError:            undefined,
  renderRequiredAsterisk: undefined,
  onAnswerChange:         () => {},
  onPanelBack:            () => {},
  onSwitchPanel:          () => {},
  panelHistory:           [],
  schema:                 {},
  validationErrors:       {}
};
