import React, { Component } from 'react';
import * as actions         from './actions';
import BaseInput            from './BaseInput';
import { defaults }         from './props';

export default class FileInput extends Component {
  render() { return ( <BaseInput type="file" {...this.props} /> ); }
};

FileInput.defaultProps = defaults;
