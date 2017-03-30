// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import styles from './Menu.scss';
import CursorMode from 'shared/enums/CursorMode';
import * as uiActions from 'shared/actions/ui';
import * as graphActions from 'shared/actions/graph';

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
    }
  }

  // TODO: [BUG] Contain does not work
  render() {
    return (
      <div className={styles.container}>
        <ul className={styles.left}>
          <li><a href="#"><i className="fa fa-file-o"/></a></li>
          <li><a href="#"><i className="fa fa-save"/></a></li>
          <li><a href="#"><i className="fa fa-folder-open-o"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.props.onCopy}><i className="fa fa-files-o"/></a></li>
          <li><a href="#" onClick={this.props.onCut}><i className="fa fa-scissors"/></a></li>
          <li><a href="#" onClick={this.props.onPaste}><i className="fa fa-clipboard"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.props.onUndo}><i className="fa fa-undo"/></a></li>
          <li><a href="#" onClick={this.props.onRedo}><i className="fa fa-repeat"/></a></li>
          <li><a href="#" onClick={this.props.onZoomIn}><i className="fa fa-search-plus"/></a></li>
          <li><a href="#" onClick={this.props.onZoomOut}><i className="fa fa-search-minus"/></a></li>
          {/*<li><a href="#" onClick={this.props.onContain}><i className="fa fa-arrows-alt"/></a></li>*/}
        </ul>
        <ul className={styles.left}>
          <li className={this.props.cursorMode == CursorMode.MULTISELECT ? styles.active : ''}><a href="#" onClick={this.props.onMultiselectMode}><i className="fa fa-mouse-pointer"/></a></li>
          <li className={this.props.cursorMode == CursorMode.PAN  ? styles.active : ''}><a href="#" onClick={this.props.onPanMode}><i className="fa fa-hand-pointer-o"/></a></li>
          <li><a href="#"><i className="fa fa-object-group"/></a></li>
        </ul>

        <ul className={styles.right}>
          <li className={this.props.showCodeView ? styles.active : ''}><a href="#" onClick={this.props.onCodeViewToggle}><i className="fa fa-code"/></a></li>
          <li><a href="#"><i className="fa fa-cog"/></a></li>
        </ul>
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
