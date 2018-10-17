import React, { Component } from 'react';

export default class SelectInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.options = this.options.bind(this);
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
  classes:  {},
  id:       '',
  name:     '',
  onBlur:   () => {},
  onChange: () => {},
  options:  [],
  value:    ''
};
