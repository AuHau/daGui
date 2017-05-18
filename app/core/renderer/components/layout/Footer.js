// @flow
import React, {Component} from 'react';

import ErrorsView from './ErrorsView';

import styles from './Footer.scss';

export default class Footer extends Component {
  render() {
    let fileInfo;
    if(this.props.framework && this.props.language){
      fileInfo = (
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
      );
    }

    return (
      <div className={styles.container}>
        {fileInfo}
        <div className={styles.left}>
          <ErrorsView messages={this.props.messages}/>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  framework: React.PropTypes.string,
  language: React.PropTypes.string,
  messages: React.PropTypes.array
};
