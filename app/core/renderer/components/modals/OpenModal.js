// @flow
import React, {Component} from 'react';
import ReactModal from 'react-modal';
import config from "../../../../config/index";
import { connect } from 'react-redux';


import styles from './OpenModal.scss';
import {newFile} from "../../../shared/actions/file";

class OpenModal extends Component {

  constructor(props){
    super(props);

    this.state = {};
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
    this.onSelectedAdapter = this.onSelectedAdapter.bind(this);
    this.onSelectedLanguage = this.onSelectedLanguage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  submit(e){
    e.preventDefault();

    this.props.newFile(this.state.name + "." + this.state.language.getFileExtension(), this.state.adapter, this.state.adaptersVersion, this.state.language, this.state.languageVersion);
    this.close();
  }

  onSelectedAdapter(e){
    const selectedAdapter = config.adapters[e.target.value];
    this.setState({
      adapter: selectedAdapter
    });
  }

  onSelectedLanguage(e){
    const selectedLanguage = config.languages[e.target.value];
    this.setState({
      language: selectedLanguage
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  close(){
    this.setState({});
    this.props.onClose();
  }

  render() {
    let adapterVersions, languages, languageVersions;
    if(this.state.adapter){
      adapterVersions = (
        <div>
          <h5>Adapter version:</h5>
          <select name="adaptersVersion" defaultValue="-1" onChange={this.handleInputChange}>
            <option value="-1" disabled>select adapter's version</option>
            {this.state.adapter.getSupportedVersions().map(version => <option key={version} value={version}>{version}</option>)}
          </select>
        </div>
      );

      languages = (
        <div>
          <h4>Language:</h4>
          <select defaultValue="-1" onChange={this.onSelectedLanguage}>
            <option value="-1" disabled>select language</option>
            {this.state.adapter.getSupportedLanguages().map(language => <option key={language.getId()} value={language.getId()}>{language.getName()}</option>)}
          </select>
        </div>
      );
    }

    if(this.state.language){
      languageVersions = (
        <div>
          <h5>Language version:</h5>
          <select name="languageVersion" defaultValue="-1" onChange={this.handleInputChange}>
            <option value="-1" disabled>select language</option>
            {this.state.adapter.getSupportedLanguageVersions(this.state.language.getId()).map(langVersion => <option key={langVersion} value={langVersion}>{langVersion}</option>)}
          </select>
        </div>
      )
    }

    const readyToSubmit = this.state.language
                            && this.state.name
                            && this.state.adapter
                            && this.state.languageVersion
                            && this.state.adaptersVersion;

    return (
      <ReactModal
        isOpen={this.props.isOpened}
        onRequestClose={this.close}
        overlayClassName={styles.overlay}
        className={styles.modal}
        contentLabel="Open Modal"
      >
        <h1>New file</h1>
        <form onSubmit={this.submit}>
          <h4>Name:</h4>
          <input type="text" name="name" onChange={this.handleInputChange}/>
          <h4>Adapter:</h4>
          <select defaultValue="-1" onChange={this.onSelectedAdapter}>
            <option value="-1" disabled>select adapter</option>
            {Object.values(config.adapters).map(adapter => <option key={adapter.getId()} value={adapter.getId()}>{adapter.getName()}</option>)}
          </select>

          {adapterVersions}
          {languages}
          {languageVersions}

          <div>
            <button type="submit" disabled={!readyToSubmit}>Create new file</button>
            <button type="button" onClick={this.close}>Cancel</button>
          </div>
        </form>
      </ReactModal>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newFile: (name, adapter, adapterVersion, language, languageVersion) => {
      dispatch(newFile(name, adapter, adapterVersion, language, languageVersion))
    }
  }
};

export default connect(() => {return {}}, mapDispatchToProps)(OpenModal);

OpenModal.propTypes = {
  isOpened: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};
