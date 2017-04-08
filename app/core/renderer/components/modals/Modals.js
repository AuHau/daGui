// @flow
import React, {Component} from 'react';

// Modals
import OpenModal from './OpenModal';

import styles from './Modals.scss';

export const modalsList = {
  OPEN: 'openModal'
};

export default class Modals extends Component {
  render() {
    return (
      <div>
        <OpenModal isOpened={this.props.openedModals.includes(modalsList.OPEN)} onClose={() => this.props.onClose(modalsList.OPEN)} />
      </div>
    );
  }
}

Modals.propTypes = {
  openedModals: React.PropTypes.array.isRequired,
  onClose: React.PropTypes.func.isRequired
};
