// @flow
import React, {Component} from 'react';
import {ipcRenderer} from 'electron';
import Scrollbar from 'react-scrollbar/dist/no-css';
import Resizable from 'renderer/components/utils/Resizable';

import styles from './ExecutionReporter.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

const tabsHeight = parseInt(cssVariables.tabsHeight);
const menuHeight = parseInt(cssVariables.menuHeight);

export default class ExecutionReporter extends Component {

  constructor(props) {
    super(props);

    this.state = {data: []};
    this.receiveData = this.receiveData.bind(this);
    this.finishedExecution = this.finishedExecution.bind(this);

    ipcRenderer.on('execution:stdout', this.receiveData('out'));
    ipcRenderer.on('execution:stderr', this.receiveData('err'));
    ipcRenderer.on('execution:done', this.finishedExecution);

    if (props.isExecutionRunning) {
      this.startExecution();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isExecutionRunning != nextProps.isExecutionRunning) {
      if (nextProps.isExecutionRunning) {
        this.setState({data: []});
        this.startExecution();
      } else {
        this.terminateExecution();
      }
    }
  }

  finishedExecution() {

  }

  startExecution() {
    if (this.props.adapter) {
      ipcRenderer.send(this.props.adapter.getId() + ':launchExec')
    }
  }

  terminateExecution() {
    if (this.props.adapter) {
      ipcRenderer.send(this.props.adapter.getId() + ':terminateExec')
    }
  }

  receiveData(type) {
    return (event, data) => {
      this.setState({data: [...this.state.data, {type: type, data: data}]})
    };
  }

  getMaxHeight(){
    return document.documentElement.clientHeight - tabsHeight - menuHeight;
  }

  render() {
    const renderedData = this.state.data.map(entry => (<div>{entry.data}</div>));

    return (
      <Resizable class={styles.container} side={"top"} getMax={this.getMaxHeight}>
        <Scrollbar className={styles.nodeList} horizontal={false}>
          {renderedData}
        </Scrollbar>
      </Resizable>
    );
  }
}

ExecutionReporter.propTypes = {
  isExecutionRunning: React.PropTypes.bool,
  adapter: React.PropTypes.func
};
