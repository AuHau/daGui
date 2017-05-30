// @flow
import React, {Component} from 'react';
import Scrollbar from 'react-scrollbar/dist/no-css';
import Resizable from 'renderer/components/utils/Resizable';
import ExecutionSidebar from './ExecutionSidebar';

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

    bindExecutorCallbacks(this.receiveData('output'), this.receiveData('error'), this.finishedExecution);

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
    this.props.onTerminateExecution();
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
      this.setState({data: [...this.state.data, {type: type, data: data}]});
      this.scrollBar.scrollArea.scrollBottom()
    }).bind(this);
  }

  getMaxHeight(){
    return document.documentElement.clientHeight - tabsHeight - menuHeight;
  }

  render() {
    const renderedData = this.state.data.map(entry => (<div className={styles[entry.type]}>{entry.data}</div>));

    let exitCode;
    if(this.state.exitCode !== null){
      exitCode = (<div className={(this.state.exitCode == 0 ? styles.okExitCode : styles.errorExitCode)}>The execution finished with exit code {this.state.exitCode}</div>);
    }

    return (
      <Resizable class={styles.container} side={"top"} getMax={this.getMaxHeight}>
        <div className={styles.sidebar}>
          <ExecutionSidebar/>
        </div>
        <Scrollbar ref={c => {this.scrollBar = c}} className={styles.dataContainer} horizontal={false}>
          {renderedData}
          {exitCode}
        </Scrollbar>
      </Resizable>
    );
  }
}

ExecutionReporter.propTypes = {
  isExecutionRunning: React.PropTypes.bool,
  adapter: React.PropTypes.func,
  onTerminateExecution: React.PropTypes.func.isRequired,
};
