import React, { Component } from 'react';

export default class TextareaInput extends Component {
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
  classes:     {},
  id:          '',
  name:        '',
  onBlur:      () => {},
  onChange:    () => {},
  placeholder: '',
  value:       ''
};
