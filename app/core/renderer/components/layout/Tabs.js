// @flow
import React, {Component} from 'react';

import styles from './Tabs.scss';

export default class Tabs extends Component {

  tabChange(index){
    return () => {
      this.props.onTabChange(index);
    }
  }

  render() {
    let renderedTabs = [];
    this.props.$files.forEach((file, index) => renderedTabs.push(<li key={index} className={this.props.currentFileIndex == index ? styles.active : ''}><a href="#"  onClick={this.tabChange(index)} title={file.get('path')}>{file.get('name')} {file.get('lastHistorySaved') === file.getIn(['history', 'present', 'historyId'])? '': ' *'}</a> <a href="#" className={styles.close} onClick={() => this.props.onTabClose(index)}><i className="icon-x"/></a></li>));

    // TODO: [Critical] Important! Handle overflowing of tabs because of long file names.
    return (
      <div className={styles.container}>
        <ul className={styles.tabs}>
          {renderedTabs}
        </ul>
      </div>
    );
  }
}

Tabs.propTypes = {
  currentFileIndex: React.PropTypes.number.isRequired,
  $files: React.PropTypes.object.isRequired,
  onTabChange: React.PropTypes.func.isRequired,
  onTabClose: React.PropTypes.func.isRequired,
};
