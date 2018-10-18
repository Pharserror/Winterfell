import React, { Component } from 'react';
import cloneArray           from '../lib/cloneArray';
import { defaults }         from './props';

export default class CheckboxOptionsInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: (
        this.props.value.length > 0
        ? cloneArray(this.props.value)
        : []
      )
    };
  }

  handleChange(newValue, event) {
    let currentValue = this.state.value;

    if (event.target.checked) {
      currentValue.push(newValue);
    } else {
      currentValue = currentValue.filter(value => value !== newValue);
    }


    this.setState(
      { value: currentValue },
      this.props.onChange.bind(null, currentValue)
    );
  }

  render() {
    return (
      <ul className={this.props.classes.checkboxList}>
        {
          this.props.options.map(option => (
            <li
              className={this.props.classes.checkboxListItem}
              key={option.value}
            >
              <label
                className={this.props.classes.checkboxLabel}
                id={this.props.labelId}
              >
                <input
                  aria-labelledby={this.props.labelId}
                  checked={this.state.value.indexOf(option.value) > -1}
                  className={this.props.classes.checkbox}
                  id={this.props.id}
                  name={this.props.name}
                  onBlur={this.props.onBlur.bind(null, this.state.value)}
                  onChange={this.handleChange.bind(this, option.value)}
                  required={this.props.required ? 'required' : undefined}
                  type="checkbox"
                  value={option.value}
                />
                {option.text}
              </label>
            </li>
          ))
        }
      </ul>
    );
  }
};

CheckboxOptionsInput.defaultProps = {
  ...defaults,
  value:   [],
  options: []
};
