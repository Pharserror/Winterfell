import React, { Component } from 'react';

export default class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      value : this.props.value
    };
  }

  handleChange(event) {
    this.setState(
      { value : event.target.value },
      this.props.onChange.bind(null, event.target.value)
    );
  }

  onBlur(event) {
    this.props.onBlur(this.state.value);
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
        onKeyDown={this.props.onKeyDown}
        placeholder={this.props.placeholder}
        required={this.props.required ? 'required' : undefined}
        type="password"
        value={this.state.value}
      />
    );
  }

};

PasswordInput.defaultProps = {
  classes:     {},
  name:        '',
  id:          '',
  value:       '',
  placeholder: '',
  onChange:    () => {},
  onBlur:      () => {},
  onKeyDown:   () => {}
};

module.exports = PasswordInput;
