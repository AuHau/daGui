// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import styles from './DetailSidebar.scss';


export default class DetailSidebar extends Component {

  render(){

    return (
      <div className={styles.container}>
        {this.props.node.get('type')}
      </div>
    );
  }
}

DetailSidebar.propTypes = {
  node: React.PropTypes.object.isRequired
};
