// @flow
import React, {Component} from 'react';

import styles from './NoFilesOpened.scss';

export default class NoFilesOpened extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>

          <i className="icon-emote-sad"/>
          <div className={styles.big}>No opened files</div>
          <div className={styles.small}>Be my guest and create a new file or open already existing one! <br/><strong>It is for free!</strong></div>

        </div>
      </div>
    );
  }
}
