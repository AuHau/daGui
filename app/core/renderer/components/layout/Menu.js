// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import styles from './Menu.scss';
import CursorMode from 'shared/enums/CursorMode';
import * as uiActions from 'shared/actions/ui';
import * as graphActions from 'shared/actions/graph';
import * as fileActions from 'shared/actions/file';

import Tooltip from 'react-tooltip';

class Menu extends Component {

  getCallback(callback, fireAlways){
    return () => {
      if(fireAlways || this.props.currentFileIndex >= 0){
        this.props[callback]();
      }
    }
  };

  componentDidMount(){
    document.addEventListener('keyup', this.keyboardShortcutsHandler.bind(this));
  }

  keyboardShortcutsHandler(e){
    if (!e.ctrlKey) return;

    switch (e.key.toLowerCase()) {
      case 'z':
        if (e.shiftKey) {
          this.getCallback('onRedo')();
        } else {
          this.getCallback('onUndo')();
        }
        break;
      case 'c':
        this.getCallback('onCopy')();
        break;
      case 'v':
        this.getCallback('onPaste')();
        break;
      case 'x':
        this.getCallback('onCut')();
        break;
      case 's':
        this.getCallback('onSave')();
        break;
      case 'o':
        this.getCallback('onOpen')();
      case 'n':
        this.getCallback('onNew')();
        break;
    }
  }

  // TODO: [BUG] Contain does not work
  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.getCallback('onNew', true)} data-tip="New file<br><span class='shortcut'>(Ctrl+N)</span>"><i className="icon-file"/></a></li>
          <li><a href="#" onClick={this.getCallback('onOpen', true)} data-tip="Open file<br><span class='shortcut'>(Ctrl+O)</span>"><i className="icon-open"/></a></li>
          <li><a href="#" onClick={this.getCallback('onSave')} data-tip="Save file<br><span class='shortcut'>(Ctrl+S)</span>"><i className="icon-save"/></a></li>
          <li><a href="#" data-tip="Save image of the graph<br><span class='shortcut'>(Ctrl+G)</span>"><i className="icon-screenshot"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.getCallback('onCopy')} data-tip="Copy node(s)<br><span class='shortcut'>(Ctrl+C)</span>"><i className="icon-copy"/></a></li>
          <li><a href="#" onClick={this.getCallback('onCut')} data-tip="Cut node(s)<br><span class='shortcut'>(Ctrl+X)</span>"><i className="icon-take-out"/></a></li>
          <li><a href="#" onClick={this.getCallback('onPaste')} data-tip="Paste node(s)<br><span class='shortcut'>(Ctrl+V)</span>"><i className="icon-paste"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.getCallback('onUndo')} data-tip="Undo<br><span class='shortcut'>(Ctrl+Z)</span>"><i className="icon-left"/></a></li>
          <li><a href="#" onClick={this.getCallback('onRedo')} data-tip="Redo<br><span class='shortcut'>(Ctrl+Shift+Z)</span>"><i className="icon-right"/></a></li>
          <li><a href="#" onClick={this.getCallback('onZoomIn')} data-tip="Zoom in<br><span class='shortcut'>(Ctrl+Mouse Wheel)</span>"><i className="icon-zoom-in"/></a></li>
          <li><a href="#" onClick={this.getCallback('onZoomOut')} data-tip="Zoom out<br><span class='shortcut'>(Ctrl+Mouse Wheel)</span>"><i className="icon-zoom-out"/></a></li>
          {/*<li><a href="#" onClick={this.getCallback('onContain')}><i className="fa fa-arrows-alt"/></a></li>*/}
        </ul>
        <ul className={styles.left}>
          <li className={this.props.cursorMode == CursorMode.MULTISELECT ? styles.active : ''}><a href="#" onClick={this.getCallback('onMultiselectMode', true)} data-tip="Selection mode"><i className="icon-hand"/></a></li>
          <li className={this.props.cursorMode == CursorMode.PAN  ? styles.active : ''}><a href="#" onClick={this.getCallback('onPanMode', true)} data-tip="Panning mode"><i className="icon-cursor"/></a></li>
          <li><a href="#" data-tip="Group nodes"><i className="fa fa-object-group"/></a></li>
        </ul>

        <ul className={styles.right}>
          <li className={this.props.showCodeView ? styles.active : ''}><a href="#" onClick={this.getCallback('onCodeViewToggle')}  data-tip="Display/hide code view"><i className="icon-code"/></a></li>
          <li><a href="#" data-tip="Settings"><i className="icon-settings"/></a></li>
        </ul>

        <ul className={styles.right}>
          <li><a href="#" data-tip="Launch the execution<br><span class='shortcut'>(Ctrl+T)</span>"><i className="fa fa-play"/></a></li>
          <li>
            <select>
              <option value="1">Local execution</option>
              <option value="2">YARN execution</option>
              <option value="2">Bah</option>
            </select>
          </li>
        </ul>
        <Tooltip place="bottom" type="dark" effect="solid" delayShow={850} className={styles.tooltip} offset={{'top': -13, 'left': -10}} html={true}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentFileIndex: state.getIn('files.active'.split('.')),
    showCodeView: state.getIn('ui.showCodeView'.split('.')),
    cursorMode: state.getIn(['ui', 'cursorMode'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCodeViewToggle: () => {
      dispatch(uiActions.codeViewToggle());
    },
    onShowSettings: (node) => {
      dispatch(uiActions.showSettings());
    },
    onContain: () => {
      dispatch(graphActions.pan('contain', 'contain'));
    },
    onZoomIn: () => {
      dispatch(graphActions.zoomIn());
    },
    onZoomOut: () => {
      dispatch(graphActions.zoomOut());
    },
    onMultiselectMode: () => {
      dispatch(uiActions.setMultiselectMode());
    },
    onPanMode: () => {
      dispatch(uiActions.setPanMode());
    },
    onUndo: () => {
      dispatch(uiActions.undo())
    },
    onRedo: () => {
      dispatch(uiActions.redo())
    },
    onCopy: () => {
      dispatch(graphActions.copy())
    },
    onCut: () => {
      dispatch(graphActions.cut())
    },
    onPaste: () => {
      dispatch(graphActions.paste())
    },
    onSave: () => {
      dispatch(fileActions.save())
    },
    onOpen: () => {
      dispatch(fileActions.open())
    },
    onNew: () => {
      dispatch(uiActions.showOpenModal())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
