export function handleChange({ target: { value } }) {
  this.setState(
    { value },
    this.props.onChange.bind(null, value)
  );
}

export function onBlur(_event) {
  this.props.onBlur(this.state.value);
}
