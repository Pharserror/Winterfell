import React, { Component } from 'react';
import * as actions         from './actions';
import BaseInput            from './BaseInput';
import { extendedProps }    from './props';

export default class TextInput extends Component {
  render() { return ( <BaseInput type="text" {...this.props} /> ); }
};

TextInput.defaultProps = extendedProps;
