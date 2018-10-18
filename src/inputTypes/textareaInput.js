import React, { Component } from 'react';
import * as actions         from './actions';
import { defaults }         from './props';

export default class TextareaInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = actions.handleChange.bind(this);
    this.onBlur = actions.onBlur.bind(this);
    this.state = { value: this.props.value };
  }

  render() {
    return (
      <textarea
        aria-labelledby={this.props.labelId}
        className={this.props.classes.input}
        id={this.props.id}
        name={this.props.name}
        onChange={this.handleChange}
        onBlur={this.onBlur}
        placeholder={this.props.placeholder}
        required={this.props.required ? 'required' : undefined}
        type="text"
        value={this.state.value}
      />
    );
  }

};

TextareaInput.defaultProps = {
  ...defaults,
  placeholder: ''
};
