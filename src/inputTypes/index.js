import isObject             from 'lodash/isObject';
import isString             from 'lodash/isString';
import React, { Component } from 'react';
import Autocomplete         from './Autocomplete';
import checkboxInput        from './checkboxInput';
import checkboxOptionsInput from './checkboxOptionsInput';
import emailInput           from './emailInput';
import fileInput            from './fileInput';
import hiddenInput          from './hiddenInput';
import passwordInput        from './passwordInput';
import radioOptionsInput    from './radioOptionsInput';
import selectInput          from './selectInput';
import textareaInput        from './textareaInput';
import textInput            from './textInput'

const inputTypes = {
  Autocomplete,
  checkboxInput,
  checkboxOptionsInput,
  emailInput,
  fileInput,
  hiddenInput,
  passwordInput,
  radioOptionsInput,
  selectInput,
  textareaInput,
  textInput
};

/**
 * Add an input type
 *
 * @param  type      name     Name of InputType
 * @param  Component instance Input Type Component
 */
inputTypes.addInputType = (name, instance) => {
  if (!isString(name)) {
    throw new Error('Winterfell: First parameter of addInputType '
                    + 'must be of type string');
  }

  if (!Component instanceof instance.constructor) {
    throw new Error(
      `Winterfell: Cannot not assign '${name}' as an inputType. Second paramter expects a React component`
    );
  }

  inputTypes[name] = instance;
};

/**
 * Add multiple InputTypes
 *
 * @param  object types InputTypes to add. string => Component
 */
inputTypes.addInputTypes = types => {
  if (!isObject(types)) {
    throw new Error(
      'Winterfell: First parameter of addInputTypes must be of type object'
    );
  }

  for (var type in types) {
    inputTypes.addInputType(type, types[type]);
  }
};

export default inputTypes;
