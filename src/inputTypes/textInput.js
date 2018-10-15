import React, { Component } from 'react';

export default class TextInput extends Component {
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
        type="text"
        name={this.props.name}
        id={this.props.id}
        aria-labelledby={this.props.labelId}
        className={this.props.classes.input}
        placeholder={this.props.placeholder}
        value={this.state.value}
        required={this.props.required ? 'required' : undefined}
        onChange={this.handleChange}
        onBlur={this.onBlur}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }
};

TextInput.defaultProps = {
  classes:     {},
  id:          '',
  name:        '',
  onBlur:      () => {},
  onChange:    () => {},
  onKeyDown:   () => {},
  placeholder: '',
  value:       ''
};
