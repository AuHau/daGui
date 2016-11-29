// @flow
import React, { Component } from 'react';
import styles from './StartupDialog.scss';


export default class StartupDialog extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h1>Welcome to DataFlow GUI!</h1>
          <ul>
            <li>Blabla</li>
          </ul>
        </div>
      </div>
    );
  }
}
