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

  componentDidMount(){
    document.addEventListener('keyup', this.keyboardShortcutsHandler.bind(this));
  }

  keyboardShortcutsHandler(e){
    if (!e.ctrlKey) return;

    switch (e.key.toLowerCase()) {
      case 'z':
        if (e.shiftKey) {
          this.props.onRedo();
        } else {
          this.props.onUndo();
        }
        break;
      case 'c':
        this.props.onCopy();
        break;
      case 'v':
        this.props.onPaste();
        break;
      case 'x':
        this.props.onCut();
        break;
      case 's':
        this.props.onSave();
        break;
      case 'o':
        this.props.onOpen();
      case 'n':
        this.props.onNew();
        break;
    }
  }

  // TODO: [BUG] Contain does not work
  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.props.onNew} data-tip="New file<br><span class='shortcut'>(Ctrl+N)</span>"><i className="icon-file"/></a></li>
          <li><a href="#" onClick={this.props.onOpen} data-tip="Open file<br><span class='shortcut'>(Ctrl+O)</span>"><i className="icon-open"/></a></li>
          <li><a href="#" onClick={this.props.onSave} data-tip="Save file<br><span class='shortcut'>(Ctrl+S)</span>"><i className="icon-save"/></a></li>
          <li><a href="#" data-tip="Save image of the graph<br><span class='shortcut'>(Ctrl+G)</span>"><i className="icon-screenshot"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.props.onCopy} data-tip="Copy node(s)<br><span class='shortcut'>(Ctrl+C)</span>"><i className="icon-copy"/></a></li>
          <li><a href="#" onClick={this.props.onCut} data-tip="Cut node(s)<br><span class='shortcut'>(Ctrl+X)</span>"><i className="icon-take-out"/></a></li>
          <li><a href="#" onClick={this.props.onPaste} data-tip="Paste node(s)<br><span class='shortcut'>(Ctrl+V)</span>"><i className="icon-paste"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.props.onUndo} data-tip="Undo<br><span class='shortcut'>(Ctrl+Z)</span>"><i className="icon-left"/></a></li>
          <li><a href="#" onClick={this.props.onRedo} data-tip="Redo<br><span class='shortcut'>(Ctrl+Shift+Z)</span>"><i className="icon-right"/></a></li>
          <li><a href="#" onClick={this.props.onZoomIn} data-tip="Zoom in<br><span class='shortcut'>(Ctrl+Mouse Wheel)</span>"><i className="icon-zoom-in"/></a></li>
          <li><a href="#" onClick={this.props.onZoomOut} data-tip="Zoom out<br><span class='shortcut'>(Ctrl+Mouse Wheel)</span>"><i className="icon-zoom-out"/></a></li>
          {/*<li><a href="#" onClick={this.props.onContain}><i className="fa fa-arrows-alt"/></a></li>*/}
        </ul>
        <ul className={styles.left}>
          <li className={this.props.cursorMode == CursorMode.MULTISELECT ? styles.active : ''}><a href="#" onClick={this.props.onMultiselectMode} data-tip="Selection mode"><i className="icon-hand"/></a></li>
          <li className={this.props.cursorMode == CursorMode.PAN  ? styles.active : ''}><a href="#" onClick={this.props.onPanMode} data-tip="Panning mode"><i className="icon-cursor"/></a></li>
          <li><a href="#" data-tip="Group nodes"><i className="fa fa-object-group"/></a></li>
        </ul>

        <ul className={styles.right}>
          <li className={this.props.showCodeView ? styles.active : ''}><a href="#" onClick={this.props.onCodeViewToggle}  data-tip="Display/hide code view"><i className="icon-code"/></a></li>
          <li><a href="#" data-tip="Settings"><i className="icon-settings"/></a></li>
        </ul>
        <Tooltip place="bottom" type="dark" effect="solid" delayShow={850} className={styles.tooltip} offset={{'top': -13, 'left': -10}} html={true}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
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
