// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './StartupDialog.scss';


export default class StartupDialog extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h1>Welcome to DataFlow GUI!</h1>
          <ul>
            <li><Link to="/newFile">Create new file</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}
