// @flow
import React, {Component} from 'react';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import ExecutionConfigurationsWell from 'renderer/wells/ExecutionConfigurationsWell';

import ConfigurationsMenu from './exec_confs/ConfigurationsMenu';

import styles from './ExecutionConfigurations.scss';

// TODO: [BUG/High] When name of configuration changes, the change won't propagate to Menu's Select
class ExecutionConfigurations extends Component {

  constructor(props){
    super(props);

    this.state = {selected:null, active: null, confs: null};
    this.deleteConf = this.deleteConf.bind(this);
    this.updateConf = this.updateConf.bind(this);
    this.selectConf = this.selectConf.bind(this);
    this.createConf = this.createConf.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.getConfs(nextProps.adapter);
    this.setState({selected: null});
  }

  async getConfs(adapter){
    if(!adapter) {
      return this.setState({confs: {}, active: null});
    }

    const confs = await ExecutionConfigurationsWell.getConfigurations(adapter.getId());
    const active = await ExecutionConfigurationsWell.getActive(adapter.getId());
    this.setState({confs, active});
  }

  deleteConf(name){
    if(this.state.confs.hasOwnProperty(name)){
      delete this.state.confs[name];

      if(name == this.state.active){
        this.saveActive(null)
          .then(() => this.saveConfs(this.state.confs))
          .then(() => this.props.refreshExecConfs());
        this.setState({confs: this.state.confs, active: null, selected: null});
      }else{
        this.saveConfs(this.state.confs);
        this.setState({confs: this.state.confs, selected: null});
      }
    }
  }

  updateConf(name, data){
    let newConfs;
    if(name != data.name){ // Renaming the configuration
      delete this.state.confs[name];
      newConfs = {...this.state.confs, [data.name]: data};
      this.setState({selected: data.name, confs: newConfs});

      if(name == this.state.active){ // Is currently active name ==> rename
        this.saveActive(data.name)
          .then(() => this.saveConfs(newConfs))
          .then(() => this.props.refreshExecConfs());
      }else{
        this.saveConfs(newConfs)
          .then(() => this.props.refreshExecConfs());
      }
    }else{
      newConfs = {...this.state.confs, [name]: data};
      this.setState({confs: newConfs});
      this.saveConfs(newConfs)
        .then(() => this.props.refreshExecConfs());
    }
  }

  createConf(){
    const names = Object.keys(this.state.confs);
    let count = 1;
    let name = "Untitled " + count;
    while(names.includes(name)){
      count++;
      name = "Untitled " + count;
    }

    this.updateConf(name, {name: name});
  }

  selectConf(name){
    this.setState({selected: name});
  }

  isNameValid(name){
    return !(Object.keys(this.state.confs).includes(name) || name.length == 0);
  }

  async saveActive(active){
    return ExecutionConfigurationsWell.setActive(this.props.adapter.getId(), active);
  }

  async saveConfs(confs){
    return ExecutionConfigurationsWell.setConfigurations(this.props.adapter.getId(), confs);
  }

  // TODO: [Low] Support adapter's versioning for Execution Configurations (Configurations will have assigned for which Adapter's versions are compatible with).
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
          Execution Configurations for {this.props.adapter.getName()}
        </header>
        <div className={styles.menu}>
          <ConfigurationsMenu active={this.state.selected} configurations={this.state.confs} onDelete={this.deleteConf} onCreate={this.createConf} onSelection={this.selectConf} />
        </div>
        <div className={styles.form}>
          <AdaptersForm configuration={this.state.selected ? this.state.confs[this.state.selected] : null} isNameValid={this.isNameValid} onClose={this.props.onClose} onUpdate={(data) => this.updateConf(this.state.selected, data)} />
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
  onClose: React.PropTypes.func.isRequired,
  refreshExecConfs: React.PropTypes.func.isRequired
};
