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
            <strong>Language: </strong>
            {this.props.language}
          </span>
          <span>
            <strong>Framework: </strong>
            {this.props.framework}
          </span>
        </div>
        <div className={styles.left}>
          {this.props.messages && <ErrorsView messages={this.props.messages}/>}
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
