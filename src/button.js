import React, { Component } from 'react';

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.onClick();
  }

  render() {
    return (
      <button
        className={this.props.className}
        href="javascript:void(0)"
        onClick={this.handleClick}
      >
        {this.props.text}
      </button>
    );
  }
};

Button.defaultProps = {
  className: undefined,
  onClick:   () => {},
  text:      'Submit'
};
