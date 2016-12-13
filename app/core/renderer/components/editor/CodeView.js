// @flow
import React, {Component} from 'react';

import styles from './CodeView.scss';

export default class CodeView extends Component {
  render() {
    return (
      <div className={styles.container}>
        {this.props.code}
      </div>
    );
  }
}

CodeView.propTypes = {
  code: React.PropTypes.string,
  onHighlight: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.string
};
