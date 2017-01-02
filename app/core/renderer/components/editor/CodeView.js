// @flow
import React, {Component} from 'react';
import CodeMarker, {values as CodeMarkerValues} from 'shared/enums/CodeMarker';

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
    this.shouldUpdateWithNextChange = true;
  }

  hookMarkers(codeMarkers) {
    const session = this.editor.getSession();
    const Range = ace.acequire('ace/range').Range;

    this.removeAllMarkers();
    this.resetRanges();

    let rangeTmp;
    for(let codeMarker of codeMarkers){
      rangeTmp = new Range(codeMarker.lineStart, codeMarker.charStart, codeMarker.lineEnd, codeMarker.charEnd);

      rangeTmp.start = session.doc.createAnchor(rangeTmp.start);
      rangeTmp.end = session.doc.createAnchor(rangeTmp.end);
      rangeTmp.end.$insertRight = true;

      if(codeMarker.type == CodeMarker.VARIABLE){
        session.addMarker(rangeTmp, styles.variable, codeMarker.type);
        rangeTmp.end.on('change', this.onAnchorChange.bind(this));
      }else if(codeMarker.type == CodeMarker.NODE){
        session.addMarker(rangeTmp, styles.node, codeMarker.type);
      }

      this.markers[codeMarker.type][codeMarker.nid] = rangeTmp;
    }
  }

  onAnchorChange(e) {
    const intersectedNid = this.intersects(CodeMarker.VARIABLE);

    // TODO: Old condition - does it make sense? What about editing first line?
    if (intersectedNid && (e.old.column != 0 && e.old.row != 0 && e.value.column != 0 && e.value.row != 0)) {
      const newVariableName = this.editor.getSession().doc.getTextRange(this.markers[CodeMarker.VARIABLE][intersectedNid]);
      this.shouldUpdateWithNextChange = false;
      this.props.onVariableNameChange(intersectedNid, newVariableName); // TODO: Validation of variable name
    }
  }

  componentDidMount(){
    const aceMode = this.props.language.getAceName();
    require('brace/mode/' + aceMode);

    this.editor = ace.edit('aceCodeEditor');
    const session = this.editor.getSession();
    session.setMode('ace/mode/' + aceMode);
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme('ace/theme/chrome');
    this.editor.setValue(this.props.codeBuilder.getCode());
    this.editor.clearSelection();
    this.hookMarkers(this.props.codeBuilder.getMarkers());

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

  componentDidUpdate(){
    this.editor.setValue(this.props.codeBuilder.getCode());
    this.hookMarkers(this.props.codeBuilder.getMarkers());
    this.editor.clearSelection();
  }

  shouldComponentUpdate(){
    // TODO: Think of some better way how to handle changes in components from which the actions originate
    const result = this.shouldUpdateWithNextChange && this.props.codeBuilder.didCodeChanged();
    this.shouldUpdateWithNextChange = true;
    return result;
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

  resetRanges(){
    if(this.markers){
      const variableMarkers = this.markers[CodeMarker.VARIABLE];
      for(let nid in variableMarkers){
        if(!variableMarkers.hasOwnProperty(nid)) continue;
        variableMarkers[nid].end.detach();
      }
    }

    this.markers = {};
    this.markers[CodeMarker.VARIABLE] = {};
    this.markers[CodeMarker.NODE] = {};
  }

  intersects(type) {
    const markersGroup = this.markers[type];
    for(let nid in markersGroup){
      if(!markersGroup.hasOwnProperty(nid)) continue;
      if(this.editor.getSelectionRange().intersects(markersGroup[nid])) return nid;
    }

    return null;
  }

  preventReadonly(next, args) {
    if (!this.intersects(CodeMarker.VARIABLE)) return;
    next();
  }

  removeAllMarkers(){
    const session = this.editor.getSession();
    const currentMarkers = session.getMarkers();
    for(let index in currentMarkers){
      if(currentMarkers.hasOwnProperty(index) && CodeMarkerValues.includes(currentMarkers[index].type)){
        session.removeMarker(currentMarkers[index].id);
      }
    }
  }
}

CodeView.propTypes = {
  codeBuilder: React.PropTypes.object.isRequired,
  language: React.PropTypes.func.isRequired,
  onHighlight: React.PropTypes.func.isRequired,
  onVariableNameChange: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array,
  highlight: React.PropTypes.string
};
