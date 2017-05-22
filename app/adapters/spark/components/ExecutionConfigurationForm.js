// @flow
import React, {Component} from 'react';

export default class ExecutionConfigurationForm extends Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

ExecutionConfigurationForm.propTypes = {
  configuration: React.PropTypes.object,
  onUpdate: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired
};
