// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import styles from './CodeInput.scss';


export default class CodeInput extends Component {

  render(){
    return (
      <div className={styles.container}>
        <textarea ref="codeInput">{this.props.node.dfGui.code}</textarea>
      </div>
    );
  }
}

CodeInput.propTypes = {
  node: React.PropTypes.object.isRequired,
  nodeTemplate: React.PropTypes.func.isRequired,
  onNodeChange: React.PropTypes.func.isRequired
};
