var React = require('react');

class CheckboxInput extends React.Component {

  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      checked : props.defaultChecked
    };
  }

  componentDidMount() {
    if (this.state.checked) {
      this.handleChange();
    }
  }

  getValue() {
    return (
      this.props.boolean
        ? this.state.checked
        : this.state.checked
          ? this.props.value
          : undefined
    );
  }

  handleChange(event) {
    if (event) {
      this.setState(
        { checked : !this.state.checked },
        () => { this.props.onChange(this.getValue()); }
      );
    } else {
      this.props.onChange(this.getValue());
    }
  }

  onBlur(event) {
    this.props.onBlur(event, this.getValue());
  }

  render() {
    return (
      <div className={this.props.classes.checkboxInput}>
        <label
          className={this.props.classes.checkboxLabel}
          id={this.props.labelId}
        >
          <input
            type="checkbox"
            name={this.props.name}
            aria-labelledby={this.props.labelId}
            className={this.props.classes.checkbox}
            defaultChecked={this.state.checked}
            value={this.getValue()}
            required={this.props.required ? 'required' : undefined}
            onChange={this.handleChange}
            onBlur={this.onBlur}
          />
          {this.props.text}
        </label>
      </div>
    );
  }

};

CheckboxInput.defaultProps = {
  text     : '',
  defaultChecked: false,
  classes  : {},
  name     : '',
  value    : '',
  onChange : () => {},
  onBlur   : () => {}
};

module.exports = CheckboxInput;
