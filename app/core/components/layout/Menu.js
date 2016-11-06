// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Menu.scss';


export default class Menu extends Component {
  render() {
    return (
      <div className={styles.container}>
        <ul>
          <li><a href="#"><i className="fa fa-file-o" /></a></li>
          <li><a href="#"><i className="fa fa-save" /></a></li>
          <li><a href="#"><i className="fa fa-folder-open-o" /></a></li>
        </ul>
      </div>
    );
  }
}
