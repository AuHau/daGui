// @flow
import React, {Component} from 'react';

import styles from './Tabs.scss';

export default class Tabs extends Component {

  onClick(index){
    return () => {
      this.props.onTabChange(index);
    }
  }

  render() {
    let renderedTabs = [];
    this.props.$files.forEach((file, index) => renderedTabs.push(<li key={index} onClick={this.onClick(index)} className={this.props.currentFileIndex == index ? 'active' : ''}><a href="#">{file.get('name')} {file.get('lastHistorySaved') === file.getIn(['history', 'present', 'historyId'])? '': ' *'}</a></li>));

    // TODO: [Critical] Important! Handle overflowing of tabs because of long file names.
    return (
      <div className={styles.container}>
        <ul className="nav nav-tabs">
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
};
