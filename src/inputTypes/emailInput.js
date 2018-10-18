import React, { Component } from 'react';
import BaseInput            from './BaseInput';
import { extendedProps }    from './props';

export default class EmailInput extends Component {
  render() { return ( <BaseInput type="email" {...this.props} /> ); }
};

EmailInput.defaultProps = extendedProps;
