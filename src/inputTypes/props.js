export const basicProps = { name: '', value: '' };
export const defaults = {
  ...basicProps,
  classes:  {},
  id:       '',
  onBlur:   () => {},
  onChange: () => {}
};

export const extendedProps = {
  ...defaults,
  onKeyDown: () => {},
  placeholder: ''
};
