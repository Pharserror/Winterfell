import chain                from 'lodash/chain';
import extend               from 'lodash/extend';
import find                 from 'lodash/find';
import isEmpty              from 'lodash/isEmpty';
import isUndefined          from 'lodash/isUndefined';
import React, { Component } from 'react';
import errorMessages        from './lib/errors';
import inputTypes           from './inputTypes';
import QuestionPanel        from './questionPanel';
import validation           from './lib/validation';

export default class Winterfell extends Component {
  constructor(props) {
    super(props);

    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleSwitchPanel = this.handleSwitchPanel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formComponent = null;
    this.panelHistory = [];
    let schema = extend(
      {
        classes: {},
        formPanels: [],
        questionPanels: [],
        questionSets: [],
      },
      props.schema
    );

    schema.formPanels = schema.formPanels.sort((a, b) => a.index > b.index);
    let panelId = (
      !isUndefined(props.panelId)
      ? props.panelId
      : !isEmpty(schema.formPanels)
      ? schema.formPanels[0].panelId
      : undefined
    );

    let currentPanel = (
      !isUndefined(schema) && !isUndefined(schema.formPanels) && !isUndefined(panelId)
        ? find(schema.formPanels, panel => panel.panelId === panelId)
        : undefined
    );

    if (!currentPanel) {
      throw new Error('Winterfell: Could not find initial panel and failed to render.');
    }

    this.state = {
      currentPanel,
      schema,
      action:          props.action,
      questionAnswers: props.questionAnswers
    };
  }

  componentDidMount() {
    this.panelHistory.push(this.state.currentPanel.panelId);
    this.props.onRender();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      action: nextProps.action,
      schema: nextProps.schema,
      questionAnswers: nextProps.questionAnswers
    });
  }

  handleAnswerChange(questionId, questionAnswer) {
    var questionAnswers = (
      chain(this.state.questionAnswers)
      .set(questionId, questionAnswer)
      .value()
    );

    this.setState(
      { questionAnswers: questionAnswers },
      this.props.onUpdate.bind(null, questionAnswers)
    );
  }

  handleSwitchPanel(panelId, preventHistory) {
    const currentPanel = find(
      this.props.schema.formPanels,
      { panelId }
    );

    if (!currentPanel) {
      throw new Error(
        `Winterfell: Tried to switch to panel ${panelId} which does not exist.`
      );
    }

    if (!preventHistory) {
      this.panelHistory.push(currentPanel.panelId);
    }

    this.setState(
      { currentPanel },
      this.props.onSwitchPanel.bind(null, currentPanel)
    );
  }

  handleBackButtonClick() {
    this.panelHistory.pop();

    this.handleSwitchPanel.call(
      this,
      this.panelHistory[this.panelHistory.length - 1],
      true
    );
  }

  handleSubmit(action) {
    if (this.props.disableSubmit) {
      this.props.onSubmit(this.state.questionAnswers, action);
      return;
    }

    /* If we are not disabling the functionality of the form,
     * we need to set the action provided in the form, then submit.
     */
    this.setState(
      { action },
      () => {
        if (!this.formComponent) { return; }
        this.formComponent.submit();
      }
    );
  }

  render() {
    let currentPanel = find(
      this.state.schema.questionPanels,
      panel => panel.panelId == this.state.currentPanel.panelId
    );

    return (
      <form
        method={this.props.method}
        encType={this.props.encType}
        action={this.state.action}
        ref={ref => this.formComponent = ref}
        className={this.state.schema.classes.form}
      >
        <div className={this.state.schema.classes.questionPanels}>
          <QuestionPanel
            schema={this.state.schema}
            classes={this.state.schema.classes}
            panelId={currentPanel.panelId}
            panelIndex={currentPanel.panelIndex}
            panelHeader={currentPanel.panelHeader}
            panelText={currentPanel.panelText}
            action={currentPanel.action}
            button={currentPanel.button}
            backButton={currentPanel.backButton}
            questionSets={currentPanel.questionSets}
            questionAnswers={this.state.questionAnswers}
            panelHistory={this.panelHistory}
            renderError={this.props.renderError}
            renderRequiredAsterisk={this.props.renderRequiredAsterisk}
            onAnswerChange={this.handleAnswerChange}
            onPanelBack={this.handleBackButtonClick}
            onSwitchPanel={this.handleSwitchPanel}
            onSubmit={this.handleSubmit}
          />
        </div>
      </form>
    );
  }
};

Winterfell.inputTypes = inputTypes;
Winterfell.errorMessages = errorMessages;
Winterfell.validation = validation;
Winterfell.addInputType = Winterfell.inputTypes.addInputType;
Winterfell.addInputTypes = Winterfell.inputTypes.addInputTypes;
Winterfell.addErrorMessage = Winterfell.errorMessages.addErrorMessage;
Winterfell.addErrorMessages = Winterfell.errorMessages.addErrorMessages;
Winterfell.addValidationMethod = Winterfell.validation.addValidationMethod;
Winterfell.addValidationMethods = Winterfell.validation.addValidationMethods;
Winterfell.defaultProps = {
  questionAnswers:        {},
  encType:                'application/x-www-form-urlencoded',
  method:                 'POST',
  action:                 '',
  panelId:                undefined,
  disableSubmit:          false,
  renderError:            undefined,
  renderRequiredAsterisk: undefined,
  onSubmit:               () => {},
  onUpdate:               () => {},
  onSwitchPanel:          () => {},
  onRender:               () => {}
};
