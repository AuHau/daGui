// @flow
import React, {Component} from 'react';
import CodeMarker from 'shared/enums/CodeMarker';

import ace from 'brace';
import 'brace/theme/chrome';

import levels, {classTranslation, textTranslation} from '../../../shared/enums/ErrorLevel';
import styles from './CodeView.scss';

function before(obj, method, wrapper) {
  var orig = obj[method];
  obj[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    return wrapper.call(this, function(){
      return orig.apply(obj, args);
    }, args);
  };

  return obj[method];
}


export default class CodeView extends Component {

  constructor(props){
    super(props);

    this.editor = null;
    this.ranges = {};
    this.ranges[CodeMarker.VARIABLE] = [];
    this.ranges[CodeMarker.NODE] = [];
  }

  intersects(type) {
    for(let range of this.ranges[type]){
      if(this.editor.getSelectionRange().intersects(range)) return true;
    }

    return false;
  }

  preventReadonly(next, args) {
    if (!this.intersects(CodeMarker.VARIABLE)) return;
    next();
  }

  hookMarkers(codeMarkers) {
    const session = this.editor.getSession();
    const Range = ace.acequire('ace/range').Range;

    let rangeTmp;
    for(let codeMarker of codeMarkers){
      rangeTmp = new Range(codeMarker.lineStart, codeMarker.charStart, codeMarker.lineEnd, codeMarker.charEnd);

      if(codeMarker.type == CodeMarker.VARIABLE){
        session.addMarker(rangeTmp, styles.variable, codeMarker.type);
      }else if(codeMarker.type == CodeMarker.NODE){
        session.addMarker(rangeTmp, styles.node, codeMarker.type);
      }

      rangeTmp.start = session.doc.createAnchor(rangeTmp.start);
      rangeTmp.end = session.doc.createAnchor(rangeTmp.end);
      rangeTmp.end.$insertRight = true;

      this.ranges[codeMarker.type].push(rangeTmp);
    }

    this.editor.keyBinding.addKeyboardHandler({
      handleKeyboard : (data, hash, keyString, keyCode, event) => {
        if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;

        if (!this.intersects(CodeMarker.VARIABLE)) {
          return {command:"null", passEvent:false};
        }
      }
    });

    before(this.editor, 'onPaste', this.preventReadonly.bind(this));
    before(this.editor, 'onCut', this.preventReadonly.bind(this));
  }

  componentDidMount(){
    const aceMode = this.props.language.getAceName();
    require('brace/mode/' + aceMode);

    this.editor = ace.edit('aceCodeEditor');
    this.editor.getSession().setMode('ace/mode/' + aceMode);
    this.editor.setTheme('ace/theme/chrome');
    this.editor.setValue(this.props.codeBuilder.getCode());
    this.editor.clearSelection();
    this.hookMarkers(this.props.codeBuilder.getMarkers());
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
  language: React.PropTypes.func.isRequired,
  onHighlight: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array,
  highlight: React.PropTypes.string
};
