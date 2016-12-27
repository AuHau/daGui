// @flow
import React, {Component} from 'react';
import ace from 'brace';
import 'brace/mode/python';
import 'brace/theme/chrome';

import levels, {classTranslation, textTranslation} from 'graph/ErrorLevel';
import styles from './CodeView.scss';

export default class CodeView extends Component {

  constructor(props){
    super(props);

    this.editor = null;
  }

  componentDidMount(){
    this.editor = ace.edit('aceCodeEditor');
    this.editor.getSession().setMode('ace/mode/python');
    this.editor.setTheme('ace/theme/chrome');
    this.editor.setValue(this.props.code);
    this.editor.setReadOnly(true);
    this.editor.clearSelection();
  }

  componentDidUpdate(){
    this.editor.setValue(this.props.code);
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
  code: React.PropTypes.string,
  errors: React.PropTypes.array,
  onHighlight: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.string
};
