import isUndefined          from 'lodash/isUndefined';
import React, { Component } from 'react';
import Question             from './question';

export default class QuestionSet extends Component {
  constructor(props) {
    super(props);

    this.questions = this.questions.bind(this);
  }

  questions() {
    return this.props.questions.map(question => (
      <Question
        classes={this.props.classes}
        input={question.input}
        key={question.questionId}
        question={question.question}
        questionId={question.questionId}
        questionSetId={this.props.id}
        questionAnswers={this.props.questionAnswers}
        onAnswerChange={this.props.onAnswerChange}
        onQuestionBlur={this.props.onQuestionBlur}
        onKeyDown={this.props.onKeyDown}
        postText={question.postText}
        renderError={this.props.renderError}
        renderRequiredAsterisk={this.props.renderRequiredAsterisk}
        text={question.text}
        validateOn={question.validateOn}
        validationErrors={this.props.validationErrors}
        validations={question.validations}
        value={this.props.questionAnswers[question.questionId]}
      />
    ));
  }

  render() {
    return (
      <div className={this.props.classes.questionSet}>
        {
          isUndefined(this.props.questionSetHeader) ||
          isUndefined(this.props.questionSetText)
          ? (
            <div className={this.props.classes.questionSetHeaderContainer}>
              {
                isUndefined(this.props.questionSetHeader)
                  ? (
                    <h4 className={this.props.classes.questionSetHeader}>
                      {this.props.questionSetHeader}
                    </h4>
                  ) : null
              }
              {
                isUndefined(this.props.questionSetText)
                  ? (
                    <p className={this.props.classes.questionSetText}>
                      {this.props.questionSetText}
                    </p>
                  ) : null
              }
            </div>
          ) : null
        }
        {questions}
      </div>
    );
  }

};

QuestionSet.defaultProps = {
  classes:                {},
  id:                     undefined,
  name:                   '',
  onAnswerChange:         () => {},
  onKeyDown:              () => {},
  onQuestionBlur:         () => {},
  questionAnswers:        {},
  questions:              [],
  questionSetHeader:      undefined,
  questionSetText:        undefined,
  renderError:            undefined,
  renderRequiredAsterisk: undefined,
  validationErrors:       {}
};
