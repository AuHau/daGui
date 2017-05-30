// @flow
import React, {Component} from 'react';
import Scrollbar from 'react-scrollbar/dist/no-css';
import Resizable from 'renderer/components/utils/Resizable';
import ExecutionConfigurationsWell from 'renderer/wells/ExecutionConfigurationsWell';
import {bindExecutorCallbacks, startExecution, terminateExecution} from 'renderer/platformConnector';

import styles from './ExecutionReporter.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

const tabsHeight = parseInt(cssVariables.tabsHeight);
const menuHeight = parseInt(cssVariables.menuHeight);

export default class ExecutionReporter extends Component {

  constructor(props) {
    super(props);

    this.state = {data: [], exitCode: null};
    this.receiveData = this.receiveData.bind(this);
    this.finishedExecution = this.finishedExecution.bind(this);

    bindExecutorCallbacks(this.receiveData('out'), this.receiveData('err'), this.finishedExecution);

    if (props.isExecutionRunning) {
      this.startExecution();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isExecutionRunning != nextProps.isExecutionRunning && nextProps.adapter) {
      if (nextProps.isExecutionRunning) {
        this.setState({data: [], exitCode: null});
        this.startExecution();
      } else if(!this.state.exitCode){
        this.terminateExecution();
      }
    }
  }

  finishedExecution(exitCode) {
    this.setState({exitCode: exitCode});
    this.props.onFinishedExecution();
  }

  async startExecution() {
    if (this.props.adapter) {
      const execConf = await ExecutionConfigurationsWell.getActiveConfiguration(this.props.adapter.getId());
      startExecution(this.props.adapter.getId(), null, execConf, null);
    }
  }

  terminateExecution() {
    if (this.props.adapter) {
      terminateExecution(this.props.adapter.getId())
    }
  }

  receiveData(type) {
    return ((data) => {
      this.setState({data: [...this.state.data, {type: type, data: data}]})
    }).bind(this);
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
  adapter: React.PropTypes.func,
  onFinishedExecution: React.PropTypes.func.isRequired,
};
