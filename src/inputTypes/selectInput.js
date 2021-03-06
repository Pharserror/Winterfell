import React, { Component } from 'react';
import * as actions         from './actions';
import { defaults }         from './props';

export default class SelectInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = actions.handleChange.bind(this);
    this.onBlur = actions.onBlur.bind(this);
    this.options = this.options.bind(this);
    this.state = {
      value : this.props.value
    };
  }

  options() {
    return (
      this.props.options.map(choice => (
        <option key={choice.value} value={choice.value}>
          {choice.text}
        </option>
      ))
    );
  }

  render() {
    return (
      <select
        className={this.props.classes.select}
        id={this.props.id}
        name={this.props.name}
        onBlur={this.onBlur}
        onChange={this.handleChange}
        required={this.props.required ? 'required' : undefined}
        value={this.state.value}
      >
        {this.options()}
      </select>
    );
  }
};

SelectInput.defaultProps = {
  ...defaults,
  options: []
};
