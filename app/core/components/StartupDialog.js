// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './StartupDialog.scss';


export default class StartupDialog extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h1>Hello!</h1>
        </div>
      </div>
    );
  }
}
