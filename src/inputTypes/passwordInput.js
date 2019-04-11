import React, { Component } from 'react';
import * as actions         from './actions';
import BaseInput            from './BaseInput';
import { extendedProps }    from './props';

export default class PasswordInput extends Component {
  render() { return ( <BaseInput type="password" {...this.props} /> ); }
};

PasswordInput.defaultProps = extendedProps;
