import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form as SemanticForm, Input, Label, TextArea } from '@indshine/ui-kit';
import validator from 'validator';
import { find, isEqual } from 'lodash-es';

class Form extends React.Component {
  static propTypes = {
    config: PropTypes.array,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    config: [],
    onSubmit: () => {},
  };

  getInitialStates = () => {
    const states = {
      errors: {},
      fields: {},
    };
    const { config } = this.props;

    config.forEach(item => {
      if (
        ['email', 'string', 'text', 'number', 'password'].includes(item.type)
      ) {
        states.fields[item.id] = item.initialValue || '';
      } else {
        states.fields[item.id] = item.initialValue || null;
      }
      states.errors[item.id] = null;
    });

    return states;
  };

  state = this.getInitialStates();

  componentDidUpdate(prevProps) {
    const { config } = this.props;
    const { config: prevConfig } = prevProps;

    if (!isEqual(prevConfig, config)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(this.getInitialStates());
    }
  }

  onEnter = () => {
    const data = this.getData();
    if (data) {
      const { onSubmit } = this.props;
      onSubmit(data);
    }
  };

  renderFields = () => {
    const { config } = this.props;
    const { errors } = this.state;

    const fields = config.map(item => {
      if (item.invisible) {
        if (typeof item.invisible === 'function') {
          if (item.invisible(this.state)) {
            return null;
          }
        } else if (item.invisible) {
          return null;
        }
      }

      if (['string', 'email', 'number', 'password'].includes(item.type)) {
        const inputType = ['email', 'string'].includes(item.type)
          ? 'text'
          : item.type;
        return (
          <SemanticForm.Field key={item.id}>
            <label>{item.label}</label>
            <Input
              value={this.state.fields[item.id] || ''}
              onChange={({ target: { value } }) => {
                this.updateField(item.id, value);
              }}
              placholder={item.label}
              type={inputType}
            />
            {errors[item.id] && (
              <Label basic pointing color="red">
                {errors[item.id]}
              </Label>
            )}
          </SemanticForm.Field>
        );
      }

      if (item.type === 'text') {
        return (
          <SemanticForm.Field key={item.id}>
            <label>{item.label}</label>
            <TextAreaContainer>
              <TextArea
                value={this.state.fields[item.id] || ''}
                onChange={({ target: { value } }) => {
                  this.updateField(item.id, value);
                }}
                placholder={item.label}
                autoHeight
              />
            </TextAreaContainer>
            {errors[item.id] && (
              <Label basic pointing color="red">
                {errors[item.id]}
              </Label>
            )}
          </SemanticForm.Field>
        );
      }

      return null;
    });

    return <React.Fragment>{fields}</React.Fragment>;
  };

  updateField = (fieldName, value) => {
    this.setState(state => ({
      fields: {
        ...state.fields,
        [fieldName]: value,
      },
      errors: {
        ...state.errors,
        [fieldName]: null,
      },
    }));
  };

  getData = () => {
    const { valid, errors } = this.validate();
    if (valid) {
      const { fields } = this.state;
      const { config } = this.props;
      const validatedData = Object.keys(fields).reduce((acc, key) => {
        const item = find(config, { id: key });
        if (item.type === 'number') {
          const number = Number.parseFloat(fields[key]);
          acc[key] = !Number.isNaN(number) ? number : null;
        } else {
          acc[key] = fields[key];
        }

        return acc;
      }, {});

      return validatedData;
    }

    this.setState({ errors });

    return null;
  };

  validate = () => {
    const errors = {};

    const { config } = this.props;

    config.forEach(item => {
      let isItemRequired;

      if (item.required) {
        if (typeof item.required === 'function') {
          isItemRequired = item.required(this.state.fields);
        } else {
          isItemRequired = true;
        }
      } else {
        isItemRequired = false;
      }

      let isItemInvisible;

      if (item.invisible) {
        if (typeof item.invisible === 'function') {
          isItemInvisible = item.invisible(this.state.fields);
        } else {
          isItemInvisible = true;
        }
      } else {
        isItemInvisible = false;
      }

      if (isItemRequired && !this.state.fields[item.id]) {
        errors[item.id] = `${item.label} is required`;
        return;
      }

      if (
        !isItemInvisible &&
        item.type === 'email' &&
        !validator.isEmail(this.state.fields[item.id])
      ) {
        errors[item.id] = 'Invalid email';
      }

      if (item.type === 'number') {
        if (
          item.required === true &&
          typeof this.state.fields[item.id] === 'string' &&
          !validator.isNumeric(this.state.fields[item.id])
        ) {
          errors[item.id] = 'Invalid number';
        } else if (
          item.minValue &&
          Number.parseFloat(this.state.fields[item.id]) < item.minValue
        ) {
          errors[item.id] = `${item.label} cannot be less than ${
            item.minValue
          }`;
        } else if (
          item.maxValue &&
          Number.parseFloat(this.state.fields[item.id]) > item.maxValue
        ) {
          errors[item.id] = `${item.label} cannot be more than ${
            item.maxValue
          }`;
        }
      }
    });

    const valid = Object.keys(errors).length === 0;
    return {
      errors,
      valid,
    };
  };

  render() {
    return (
      <SemanticForm
        onKeyDown={event => {
          if (event.keyCode === 13) {
            this.onEnter();
          }
        }}
      >
        {this.renderFields()}
      </SemanticForm>
    );
  }
}

export default Form;

const TextAreaContainer = styled.div`
  textarea {
    font-family: inherit !important;
  }
`;
