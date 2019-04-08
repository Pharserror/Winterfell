import React, { Component } from 'react';
import Selectr              from 'selectr';

export default class Autocomplete extends Component {
  render() {
    return (
      <Selectr onSelectOption={this.props.onChange} {...this.props} />
    );
  }
}
