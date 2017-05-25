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

    this.state = {active: null, confs: null};
    this.deleteConf = this.deleteConf.bind(this);
    this.updateConf = this.updateConf.bind(this);
    this.selectConf = this.selectConf.bind(this);
    this.createConf = this.createConf.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.getConfs(nextProps.adapter);
    this.setState({active: null});
  }

  async getConfs(adapter){
    if(!adapter) {
      return this.setState({confs: {}});
    }

    const confs = await ExecutionConfigurationsWell.getConfigurations(adapter.getId());
    this.setState({confs: confs});
  }

  deleteConf(name){
    if(this.state.confs.hasOwnProperty(name)){
      delete this.state.confs[name];
      this.saveConfs(this.state.confs);
      this.setState({confs: this.state.confs, active: null});
    }
  }

  updateConf(name, data){
    let newConfs;
    if(name != data.name){
      delete this.state.confs[name];
      newConfs = {...this.state.confs, [data.name]: data};
      this.setState({active: data.name, confs: newConfs});
    }else{
      newConfs = {...this.state.confs, [name]: data};
      this.setState({confs: newConfs});
    }
    this.saveConfs(newConfs);
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
    this.setState({active: name});
  }

  isNameValid(name){
    return !(Object.keys(this.state.confs).includes(name) || name.length == 0);
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
          <ConfigurationsMenu active={this.state.active} configurations={this.state.confs} onDelete={this.deleteConf} onCreate={this.createConf} onSelection={this.selectConf} />
        </div>
        <div className={styles.form}>
          <AdaptersForm configuration={this.state.active ? this.state.confs[this.state.active] : null} isNameValid={this.isNameValid} onClose={this.props.onClose} onUpdate={(data) => this.updateConf(this.state.active, data)} />
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
