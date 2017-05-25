// @flow
import React, {Component} from 'react';

import Resizable from 'renderer/components/utils/Resizable';

import styles from './ExecutionReporter.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

const tabsHeight = parseInt(cssVariables.tabsHeight);
const menuHeight = parseInt(cssVariables.menuHeight);

export default class ExecutionReporter extends Component {

  getMaxHeight(){
    return document.documentElement.clientHeight - tabsHeight - menuHeight;
  }

  render() {
    return (
      <Resizable class={styles.container} side={"top"} getMax={this.getMaxHeight}>
      </Resizable>
    );
  }
}

ExecutionReporter.propTypes = {

};
