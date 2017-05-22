// @flow
import React, {Component} from 'react';

// Modals
import NewFileModal from './NewFileModal';
import ExecutionConfigurations from './ExecutionConfigurations';

import styles from './Modals.scss';

export const modalsList = {
  NEW_FILE: 'newFile',
  EXEC_CONFS: 'execConfs',
};

export default class Modals extends Component {
  render() {
    return (
      <div>
        <NewFileModal isOpened={this.props.openedModals.includes(modalsList.NEW_FILE)} onClose={() => this.props.onClose(modalsList.NEW_FILE)} />
        <ExecutionConfigurations isOpened={this.props.openedModals.includes(modalsList.EXEC_CONFS)} onClose={() => this.props.onClose(modalsList.EXEC_CONFS)} />
      </div>
    );
  }
}

Modals.propTypes = {
  openedModals: React.PropTypes.array.isRequired,
  onClose: React.PropTypes.func.isRequired
};
