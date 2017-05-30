// @flow
import React, {Component} from 'react';

import styles from './ExecutionSidebar.scss';

export default class ExecutionSidebar extends Component {
  render() {
    return (
      <div className={styles.container}>

      </div>
    );
  }
}

ExecutionSidebar.propTypes = {
  framework: React.PropTypes.string,
  language: React.PropTypes.string,
  messages: React.PropTypes.array
};
