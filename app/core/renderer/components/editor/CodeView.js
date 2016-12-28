// @flow
import React, {Component} from 'react';
import ace from 'brace';
import 'brace/theme/chrome';

import levels, {classTranslation, textTranslation} from '../../../shared/enums/ErrorLevel';
import styles from './CodeView.scss';

export default class CodeView extends Component {

  constructor(props){
    super(props);

    this.editor = null;
  }

  componentDidMount(){
    const aceMode = this.props.language.getAceName();
    require('brace/mode/' + aceMode);

    this.editor = ace.edit('aceCodeEditor');
    this.editor.getSession().setMode('ace/mode/' + aceMode);
    this.editor.setTheme('ace/theme/chrome');
    this.editor.setValue(this.props.codeBuilder.getCode());
    this.editor.clearSelection();
  }

  componentDidUpdate(){
    this.editor.setValue(this.props.codeBuilder.getCode());
    this.editor.clearSelection();
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderErrors()}
        <div className={styles.codeEditor} id="aceCodeEditor"></div>
      </div>
    );
  }

  renderErrors(){
    if(!this.props.errors || !this.props.errors.length) return;

    const orderedErrors = this.props.errors.sort((a, b) => b.importance - a.importance);
    const detailedErrors = orderedErrors.map((err, index) =>  (
      <div key={index} className={styles[classTranslation[err.level]]}><strong>{textTranslation[err.level]}:</strong> {err.description}</div>
    ));

    return (<div className={styles.errorsOverlay}>
      <h3>Errors found!</h3>
      {detailedErrors}
      </div>)
  }
}

CodeView.propTypes = {
  codeBuilder: React.PropTypes.object.isRequired,
  language: React.PropTypes.object.isRequired,
  onHighlight: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array,
  highlight: React.PropTypes.string
};
