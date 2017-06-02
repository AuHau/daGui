// @flow
import React, {Component} from 'react';
import ReactModal from 'react-modal';
import config from "../../../../config/index";
import { connect } from 'react-redux';

import Input from 'renderer/components/form/Input';
import Button from 'renderer/components/form/Button';
import Scrollbar from 'react-scrollbar/dist/no-css';
import Select from 'react-select';

import styles from './NewFileModal.scss';
import {newFile} from "../../../shared/actions/file";

class NewFileModal extends Component {

  constructor(props){
    super(props);

    this.state = {};
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
    this.onSelectedAdapter = this.onSelectedAdapter.bind(this);
    this.onSelectedLanguage = this.onSelectedLanguage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  shouldComponentUpdate(nextProps){
    return nextProps.isOpened || (!nextProps.isOpened && this.props.isOpened);
  }

  submit(e){
    e.preventDefault();

    this.props.newFile(this.state.name + "." + this.state.language.getFileExtension(), this.state.adapter, this.state.adaptersVersion, this.state.language, this.state.languageVersion);
    this.close();
  }

  onSelectedAdapter(e){
    const selectedAdapter = config.adapters[e.value];
    this.setState({
      adapter: selectedAdapter
    });
  }

  onSelectedLanguage(e){
    const selectedLanguage = config.languages[e.value];
    this.setState({
      language: selectedLanguage
    });
  }

  // TODO: [BUG/Low] The name has to be valid file name (i.e., validation of the used characters - no @#$...)
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSelectChange(name) {
    return (value) => {

      this.setState({
        [name]: value.value
      });
    }
  }

  close(){
    this.setState({
      name: undefined,
      adaptersVersion: undefined,
      language: undefined,
      languageVersions: undefined,
      adapter: undefined,
    });
    this.props.onClose();
  }

  render() {
    let adapterVersions, languages, languageVersions;
    if(this.state.adapter){
      adapterVersions = (
        <div>
          <h5>Adapter version:</h5>

          <Select
            value={this.state.adaptersVersion}
            options={this.state.adapter.getSupportedVersions().map(version => {return {value: version, label: version}})}
            clearable={false}
            searchable={false}
            className={styles.select}
            placeholder="Select adapter's version"
            onChange={this.handleSelectChange('adaptersVersion')}/>
        </div>
      );
    }

    if(this.state.adaptersVersion){
      languages = (
        <div>
          <h4>Language:</h4>

          <Select
            value={(this.state.language ? this.state.language.getId() : undefined)}
            options={this.state.adapter.getSupportedLanguages(this.state.adaptersVersion).map(language => {return {value: language.getId(), label: language.getName()}})}
            clearable={false}
            searchable={false}
            className={styles.select}
            placeholder="Select language"
            onChange={this.onSelectedLanguage}/>
        </div>
      );
    }

    if(this.state.language && this.state.adaptersVersion){
      languageVersions = (
        <div>
          <h5>Language version:</h5>

          <Select
            value={this.state.languageVersion}
            options={this.state.adapter.getSupportedLanguageVersions(this.state.language.getId(), this.state.adaptersVersion).map(version => {return {value: version, label: version}})}
            clearable={false}
            searchable={false}
            className={styles.select}
            placeholder="Select language's version"
            onChange={this.handleSelectChange('languageVersion')}/>
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
        contentLabel="New File Modal"
      >
        <header>New file</header>
        <div className={styles.contentWrapper}>
          <Scrollbar className={styles.content}>
            <h4>Name:</h4>
            <Input name="name" value={this.state.name} onChange={this.handleInputChange}/>

            <div className={styles.columnsWrapper}>
              <div className={styles.column}>
                <h4>Adapter:</h4>
                <Select
                  value={(this.state.adapter ? this.state.adapter.getId() : undefined)}
                  options={Object.values(config.adapters).map(adapter => {return {value: adapter.getId(), label: adapter.getName()}})}
                  clearable={false}
                  searchable={false}
                  className={styles.select}
                  placeholder="Select adapter"
                  onChange={this.onSelectedAdapter}/>

                {adapterVersions}
              </div>
              <div className={styles.column}>
                {languages}
                {languageVersions}
              </div>
            </div>
          </Scrollbar>
          <div className={styles.buttonBar}>
            <Button className={styles.button} onClick={this.submit} disabled={!readyToSubmit}>Create new file</Button>
            <Button className={styles.button} onClick={this.close}>Cancel</Button>
          </div>
        </div>
        <a href="#" className={styles.close} onClick={this.close}><i className="icon-x"/></a>
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

export default connect(() => {return {}}, mapDispatchToProps)(NewFileModal);

NewFileModal.propTypes = {
  isOpened: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};
