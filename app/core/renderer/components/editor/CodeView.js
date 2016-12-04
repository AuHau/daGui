// @flow
import React, {Component} from 'react';

import styles from './CodeView.scss';

export default class CodeView extends Component {
  render() {
    return (
      <div className={styles.container}>
        Here gonna be super cool code!
      </div>
    );
  }
}

CodeView.propTypes = {
  code: React.PropTypes.object.isRequired,
  onHighlight: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.string
};
