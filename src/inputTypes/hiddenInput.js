import React, { Component } from 'react';
import { basicProps }       from './props';

export default class HiddenInput extends Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value };
  }

  render() {
    return (
      <input
        name={this.props.name}
        type="hidden"
        value={this.state.value}
      />
    );
  }
};

HiddenInput.defaultProps = basicProps;
