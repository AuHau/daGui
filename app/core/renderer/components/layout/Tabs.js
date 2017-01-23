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
    const renderedTabs = this.props.files.map((file, index) => <li key={index} onClick={this.onClick(index)} className={this.props.currentFileIndex == index ? 'active' : ''}><a href="#">{file.name}</a></li>);

    // TODO: Important! Handle overflowing of tabs because of long file names.
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
  files: React.PropTypes.array.isRequired,
  onTabChange: React.PropTypes.func.isRequired,
};
