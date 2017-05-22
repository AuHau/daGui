// @flow
import React, {Component} from 'react';
import ReactModal from 'react-modal';
import config from "../../../../config/index";
import { connect } from 'react-redux';
import ConfigurationsMenu from './exec_confs/ConfigurationsMenu';

import styles from './ExecutionConfigurations.scss';

const CONFS_STORAGE_PREFIX = "exec_confs:";
const UNTITLED_REGEX = new RegExp(/^Untitled [0-9]+$/);

class ExecutionConfigurations extends Component {

  constructor(props){
    super(props);

    this.state = {active: null, confs: null};
    this.deleteConf = this.deleteConf.bind(this);
    this.updateConf = this.updateConf.bind(this);
    this.selectConf = this.selectConf.bind(this);
    this.createConf = this.createConf.bind(this);
  }

  componentWillReceiveProps(){
    this.getConfs();
    this.setState({active: null});
  }

  getConfs(){
    if(!this.props.adapter) {
      return this.setState({confs: {}});
    }

    this.setState({confs: JSON.parse(localStorage.getItem(CONFS_STORAGE_PREFIX + this.props.adapter.getId())) || {}});
  }

  deleteConf(name){
    if(this.state.confs.hasOwnProperty(name)){
      delete this.state.confs[name];
      this.setState({confs: this.state.confs, active: null});
    }
  }

  updateConf(name, data){
    this.setState({confs: {[name]: data, ...this.state.confs}});
    this.saveConfs();
  }

  createConf(){
    const names = Object.keys(this.state.confs);
    let count = 1;
    let title = "Untitled " + count;
    while(names.includes(title)){
      count++;
      title = "Untitled " + count;
    }

    this.updateConf(title, {});
  }

  selectConf(name){
    this.setState({active: name});
  }

  saveConfs(){
    localStorage.setItem(CONFS_STORAGE_PREFIX + this.props.adapter.getId(), JSON.stringify(this.state.confs));
  }

  render() {
    // When there is no opened file
    if(!this.props.adapter){
      return (<div></div>);
    }

    const AdaptersForm = this.props.adapter.getExecutionConfigurationForm();

    return (
      <ReactModal
        isOpen={this.props.isOpened}
        onRequestClose={() => this.props.onClose()}
        overlayClassName={styles.overlay}
        className={styles.modal}
        contentLabel="Execution Configurations Modal"
      >
        <header>
          Execution Configurations
        </header>
        <div className={styles.menu}>
          <ConfigurationsMenu active={this.state.active} configurations={this.state.confs} onDelete={this.deleteConf} onCreate={this.createConf} onSelection={this.selectConf} />
        </div>
        <div className={styles.form}>
          <AdaptersForm onClose={this.props.onClose} onUpdate={(data) => this.updateConf(this.state.active, data)} />
        </div>
        <a href="#" className={styles.close} onClick={this.props.onClose}><i className="icon-x"/></a>

      </ReactModal>
    );
  }

  shouldComponentUpdate(nextProps){
    return (nextProps.isOpened || (!nextProps.isOpened && this.props.isOpened));
  }
}

const mapStateToProps = (state) => {
  const activeFileIndex = state.getIn('files.active'.split('.'));

  if(activeFileIndex < 0){
    return{
      adapter: null
    };
  }

  return {
    adapter: state.getIn(['files', 'opened', activeFileIndex, 'adapter']),
  }
};

export default connect(mapStateToProps, () => {return {}})(ExecutionConfigurations);

ExecutionConfigurations.propTypes = {
  isOpened: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};
