// @flow
import React, {Component} from 'react';
import Scrollbar from 'react-scrollbar/dist/no-css';

import Input from 'renderer/components/form/Input';
import Button, {ButtonTypes} from 'renderer/components/form/Button';

import styles from './ExecutionConfigurationForm.scss';

export const SPARK_MODES = {
  ALL: 'Generic settings',
  STANDALONE: 'Standalone mode',
  MESOS: 'Mesos mode',
  YARN: 'YARN mode'
};

const SPARK_PARAMS = [
  {name: 'master', mode: [SPARK_MODES.ALL], label: 'Master URL', help: 'spark://host:port, mesos://host:port, yarn, or local'},
  {name: 'deploy-mode', mode: [SPARK_MODES.ALL], label: 'Deploy mode', help: 'Whether to launch the driver program locally ("client") or on one of the worker machines inside the cluster ("cluster") (Default: client).'},
  {name: 'app-name', mode: [SPARK_MODES.ALL], label: 'Application name', help: 'If not specified then the name of the file will be used.'},
  {name: 'jars', mode: [SPARK_MODES.ALL], label: 'Local Jars', help: 'Comma-separated list of local jars to include on the driver and executor classpaths.'},
  {name: 'packages', mode: [SPARK_MODES.ALL], label: 'Maven packages', help: ' Comma-separated list of maven coordinates of jars to include on the driver and executor classpaths. Will search the local maven repo, then maven central and any additional remote repositories given by --repositories. The format for the coordinates should be groupId:artifactId:version.'},
  {name: 'exclude-packages', mode: [SPARK_MODES.ALL], label: 'Exclude packages', help: 'Comma-separated list of groupId:artifactId, to exclude while resolving the dependencies provided in --packages to avoid dependency conflicts.'},
  {name: 'repositories', mode: [SPARK_MODES.ALL], label: 'Remote repositories', help: 'Comma-separated list of additional remote repositories to search for the maven coordinates given with --packages.'},
  {name: 'py-files', mode: [SPARK_MODES.ALL], label: 'Python files', help: 'Comma-separated list of .zip, .egg, or .py files to place on the PYTHONPATH for Python apps.'},
  {name: 'files', mode: [SPARK_MODES.ALL], label: 'Files', help: 'Comma-separated list of files to be placed in the working directory of each executor.'},
  {name: 'conf', mode: [SPARK_MODES.ALL], label: 'Additional configuration', help: 'Arbitrary Spark configuration property in format PROP=VALUE.'},
  {name: 'properties-file', mode: [SPARK_MODES.ALL], label: 'Properties file', help: ' Path to a file from which to load extra properties. If not specified, this will look for conf/spark-defaults.conf.'},
  {name: 'driver-memory', mode: [SPARK_MODES.ALL], label: 'Driver memory', help: 'Memory for driver (e.g. 1000M, 2G) (Default: 1024M).'},
  {name: 'driver-java-options', mode: [SPARK_MODES.ALL], label: 'Driver Java options', help: 'Extra Java options to pass to the driver.'},
  {name: 'driver-library-path', mode: [SPARK_MODES.ALL], label: 'Driver library path', help: 'Extra library path entries to pass to the driver.'},
  {name: 'driver-class-path', mode: [SPARK_MODES.ALL], label: 'Driver class path', help: 'Extra class path entries to pass to the driver. Note that jars added with --jars are automatically included in the classpath.'},
  {name: 'executor-memory', mode: [SPARK_MODES.ALL], label: 'Executor memory', help: 'Memory per executor (e.g. 1000M, 2G) (Default: 1G).'},
  {name: 'proxy-user', mode: [SPARK_MODES.ALL], label: 'Proxy user', help: 'User to impersonate when submitting the application. This argument does not work with --principal / --keytab.'},
  {name: 'driver-cores', mode: [SPARK_MODES.STANDALONE, SPARK_MODES.YARN], label: 'Driver cores', help: 'Cores for driver (Default: 1).'},
  {name: 'supervise', type: 'bool', mode: [SPARK_MODES.STANDALONE, SPARK_MODES.MESOS], label: 'Supervise', help: 'If given, restarts the driver on failure.'},
  {name: 'kill', mode: [SPARK_MODES.STANDALONE, SPARK_MODES.MESOS], label: 'Kill submission', help: 'If given, kills the driver specified.'},
  {name: 'status', mode: [SPARK_MODES.STANDALONE, SPARK_MODES.MESOS], label: 'Status of submission', help: 'If given, requests the status of the driver specified.'},
  {name: 'total-executor-cores', mode: [SPARK_MODES.STANDALONE, SPARK_MODES.MESOS], label: 'Total cores for all executors.'},
  {name: 'executor-cores', mode: [SPARK_MODES.STANDALONE, SPARK_MODES.YARN], label: 'Executor cores', help: 'Number of cores per executor. (Default: 1 in YARN mode, or all available cores on the worker in standalone mode)'},
  {name: 'queue', mode: [SPARK_MODES.YARN], label: 'Queue name', help: 'The YARN queue to submit to (Default: "default").'},
  {name: 'num-executors', mode: [SPARK_MODES.YARN], label: 'Number of executors', help: 'Number of executors to launch (Default: 2). If dynamic allocation is enabled, the initial number of executors will be at least NUM.'},
  {name: 'archives', mode: [SPARK_MODES.YARN], label: 'Archives', help: 'Comma separated list of archives to be extracted into the working directory of each executor.'},
  {name: 'principal', mode: [SPARK_MODES.YARN], label: 'Principal', help: 'Principal to be used to login to KDC, while running on secure HDFS.'},
  {name: 'keytab', mode: [SPARK_MODES.YARN], label: 'Keytab', help: 'The full path to the file that contains the keytab for the principal specified above. This keytab will be copied to the node running the Application Master via the Secure Distributed Cache, for renewing the login tickets and the delegation tokens periodically.'},
];

export default class ExecutionConfigurationForm extends Component {

  constructor(props){
    super(props);

    this.state = {conf: this.props.configuration, $errors: {}};
    this.onSave = this.onSave.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  };

  componentWillReceiveProps(nextProps){
    this.setState({conf: nextProps.configuration, $errors: {}});
  }

  onNameChange(e){
    const newName = e.target.value;
    if(!this.props.isNameValid(newName) && newName != this.props.configuration.name){
      this.setState({conf: {...this.state.conf, name: newName}, $errors: {...this.state.$errors, name: "The name of the configuration is not valid! It must be a unique name and must not be an empty string!"}})
    }else if(this.state.$errors.name){
      delete this.state.$errors.name;
      this.setState({conf: {...this.state.conf, name: newName}, $errors: this.state.$errors})
    }else{
      this.setState({conf: {...this.state.conf, name: newName}});
    }
  }

  onInputChange(e){
    const name = e.target.name;
    const value = e.target.value;

    if(value == ""){
      const newConf = {...this.state.conf};
      if(newConf[name]){
        delete newConf[name];
        this.setState({conf: newConf});
      }
    }else{
      this.setState({conf: {...this.state.conf, [name]:value}});
    }
  }

  onSave(){
    if(Object.keys(this.state.$errors).length == 0){
      this.props.onUpdate(JSON.parse(JSON.stringify(this.state.conf)));
    }
  }

  render() {
    if(!this.state.conf){
      return (<div/>);
    }

    let inputs = [];
    for(let mode of Object.values(SPARK_MODES)){
      inputs.push((<h3 key={mode}>{mode}</h3>));
      inputs = inputs.concat(
        SPARK_PARAMS
          .filter(input => input.mode.includes(mode))
          .map(input => (<Input key={mode + input.name} onChange={this.onInputChange} label={input.label} name={input.name} value={this.state.conf[input.name] || ''} help={input.help}/>))
      );
    }

    return (
      <div className={styles.container}>
        <Scrollbar className={styles.formWrapper} horizontal={false} >
          <Input label="Name of configuration" error={this.state.$errors.name ? this.state.$errors.name : null } required={true} value={this.state.conf.name || ''} onChange={this.onNameChange} />
          {inputs}
        </Scrollbar>
        <div className={styles.buttonBar}>
          <Button className={styles.button} onClick={this.onSave} disabled={Object.keys(this.state.$errors).length > 0}>Save</Button>
          <Button className={styles.button} onClick={this.props.onClose}>Cancel</Button>
        </div>
      </div>
    );
  }
}

ExecutionConfigurationForm.propTypes = {
  configuration: React.PropTypes.object,
  onUpdate: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  isNameValid: React.PropTypes.func.isRequired
};
