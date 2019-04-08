import React, { Component } from 'react';
import { defaults }         from './props';

export default class RadioOptionsInput extends Component {
  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
    this.state = { value: this.props.value };
  }

  handleChange(value) {
    this.setState(
      { value },
      this.props.onChange.bind(null, value)
    );
  }

  onBlur(event) {
    this.props.onBlur(this.state.value);
  }

  render() {
    return (
      <ul className={this.props.classes.radioList}>
        {
          this.props.options.map(choice => (
            <li
              key={choice.value}
              className={this.props.classes.radioListItem}
            >
              <label
                className={this.props.classes.radioLabel}
                id={this.props.labelId}
              >
                <input
                  aria-labelledby={this.props.labelId}
                  checked={this.state.value === choice.value}
                  className={this.props.classes.radio}
                  id={this.props.id}
                  name={this.props.name}
                  onBlur={this.onBlur}
                  onChange={this.handleChange.bind(this, choice.value)}
                  required={this.props.required ? 'required' : undefined}
                  type="radio"
                />
                {choice.text}
              </label>
            </li>
          ))
        }
      </ul>
    );
  }

};

RadioOptionsInput.defaultProps = {
  ...defaults,
  options: [],
};
