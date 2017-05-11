// @flow
import React, {Component} from 'react';

import ErrorsView from './ErrorsView';

import styles from './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.right}>
          <span>
            Language:
            <strong>{this.props.language}</strong>
          </span>
          <span>
            Framework:
            <strong>{this.props.framework}</strong>
          </span>
        </div>
        <div className={styles.left}>
          <ErrorsView messages={this.props.messages}/>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  framework: React.PropTypes.string.isRequired,
  language: React.PropTypes.string.isRequired,
  messages: React.PropTypes.array
};
