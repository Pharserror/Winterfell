import React, { Component } from 'react';
import * as actions         from './actions';
import { defaults }         from './props';

export default class BaseInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = actions.handleChange.bind(this);
    this.onBlur = actions.onBlur.bind(this);
    this.state = { value: this.props.value };
  }

  render() {
    return (
      <input
        aria-labelledby={this.props.labelId}
        className={this.props.classes.input}
        id={this.props.id}
        name={this.props.name}
        onBlur={this.onBlur}
        onChange={this.handleChange}
        required={this.props.required ? 'required' : undefined}
        type={this.props.type}
        value={this.state.value}
      />
    );
  }
}

BaseInput.defaultProps = defaults;
