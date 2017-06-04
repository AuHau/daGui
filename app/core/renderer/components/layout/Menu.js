// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import ExecutionConfigurationsWell from 'renderer/wells/ExecutionConfigurationsWell';
import styles from './Menu.scss';
import CursorMode from 'shared/enums/CursorMode';
import * as uiActions from 'shared/actions/ui';
import * as graphActions from 'shared/actions/graph';
import * as fileActions from 'shared/actions/file';

import Tooltip from 'react-tooltip';


// TODO: [BUG/Critical] Copy/Cut/Paste support --> check that the event originates from the Canvas. Can not copy from CodeView
class Menu extends Component {

  constructor(props){
    super(props);

    this.executionConfChange = this.executionConfChange.bind(this);
    this.keyboardShortcutsHandler = this.keyboardShortcutsHandler.bind(this);
    this.state = {currentExecutionConf: null, confs: []};
    if(props.adapter) this.loadExecConfs(props.adapter.getId());
  }

  getCallback(callback, fireAlways){
    return () => {
      if(fireAlways || this.props.currentFileIndex >= 0){
        if(this.props.hasOwnProperty(callback)){
          this.props[callback]();
        }else if(this.hasOwnProperty(callback)){
          this[callback]();
        }else{
          throw new Error("Unknown callback '" + callback + "'!");
        }
      }
    }
  };

  componentWillReceiveProps(nextProps){
    if((!this.props.adapter && nextProps.adapter)
      || (this.props.adapter && nextProps.adapter && nextProps.adapter.getId() != this.props.adapter.getId()) ){
      this.loadExecConfs(nextProps.adapter.getId());
    }
  }

  componentDidMount(){
    document.addEventListener('keyup', this.keyboardShortcutsHandler);
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
        // TODO: [BUG/High] The "artificial" input nodes (React-select, Ace editor) won't loose focus when user click into SVG area
        if(e.target.nodeName == "BODY"){ // Copy only when nothing is focused (e.g., input fields, text areas etc.)
          this.getCallback('onCopy')();
        }
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
        break;
      case 'n':
        this.getCallback('onNew')();
        break;
      case 'e':
        this.getCallback('onSaveImage')();
        break;
    }
  }

  async loadExecConfs(adapterId){
    const confs = await ExecutionConfigurationsWell.getConfigurations(adapterId);
    const active = await ExecutionConfigurationsWell.getActive(adapterId);

    this.setState({currentExecutionConf: active, confs: Object.values(confs)})
  }

  executionConfChange(val){
    val = val.value;
    if(val !=  'conf'){
      this.setState({currentExecutionConf: val});
      ExecutionConfigurationsWell.setActive(this.props.adapter.getId(), val);
    }else{
      this.props.onOpenExecConfs();
    }
  }

  // TODO: [BUG] Contain does not work
  render() {
    const confsOptions = this.state.confs.map(conf => {return {value: conf.name, label: conf.name}});
    confsOptions.push({ value: 'conf', label: 'Edit configurations', classNames: styles.configureOption});

    let execItems;
    if(this.props.adapter && this.props.adapter.hasExecutionSupport()){
      execItems = (
        <ul className={styles.right}>
          {!this.props.isExecutionRunning && <li className={styles.launchIcon}><a href="#" onClick={this.getCallback('onExecutionStart')} data-tip="Launch the execution<br><span class='shortcut'>(Ctrl+T)</span>"><i className="fa fa-play"/></a></li>}
          {this.props.isExecutionRunning && <li className={styles.launchIcon}><a href="#" onClick={this.getCallback('onExecutionTermination')} data-tip="Terminate the execution<br><span class='shortcut'>(Ctrl+T)</span>"><i className="fa fa-stop"/></a></li>}
          <li className={styles.execViewIcon + (this.props.showExecutionReporter ? " " + styles.active : '')}><a
            href="#" onClick={this.getCallback('onToggleExecutionReporter')} data-tip="Show/Display log of execution"><i
            className="fa fa-file-text-o"/></a></li>
          <li>
            <Select
              value={this.state.currentExecutionConf}
              options={confsOptions}
              clearable={false}
              searchable={false}
              className={styles.selectWithLastOption}
              onChange={this.executionConfChange}
            />
          </li>
        </ul>
      );
    }

    return (
      <div className={styles.container}>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.getCallback('onNew', true)} data-tip="New file<br><span class='shortcut'>(Ctrl+N)</span>"><i className="icon-file"/></a></li>
          <li><a href="#" onClick={this.getCallback('onOpen', true)} data-tip="Open file<br><span class='shortcut'>(Ctrl+O)</span>"><i className="icon-open"/></a></li>
          <li><a href="#" onClick={this.getCallback('onSave')} data-tip="Save file<br><span class='shortcut'>(Ctrl+S)</span>"><i className="icon-save"/></a></li>
          <li><a href="#" onClick={this.getCallback('onSaveImage')} data-tip="Save image of the graph<br><span class='shortcut'>(Ctrl+E)</span>"><i className="icon-screenshot"/></a></li>
        </ul>
        <ul className={styles.left}>
          <li><a href="#" onClick={this.getCallback('onCopy')} data-tip="Copy node(s)<br><span class='shortcut'>(Ctrl+C)</span>"><i className="icon-copy"/></a></li>
          <li><a href="#" onClick={this.getCallback('onCut')} data-tip="Cut node(s)<br><span class='shortcut'>(Ctrl+X)</span>"><i className="icon-take-out"/></a></li>
          <li><a href="#" onClick={this.getCallback('onPaste')} data-tip="Paste node(s)<br><span class='shortcut'>(Ctrl+V)</span>"><i className="icon-paste"/></a></li>
        </ul>
        <ul className={styles
          .left}>
          <li><a href="#" onClick={this.getCallback('onUndo')} data-tip="Undo<br><span class='shortcut'>(Ctrl+Z)</span>"><i className="icon-left"/></a></li>
          <li><a href="#" onClick={this.getCallback('onRedo')} data-tip="Redo<br><span class='shortcut'>(Ctrl+Shift+Z)</span>"><i className="icon-right"/></a></li>
          <li><a href="#" onClick={this.getCallback('onZoomIn')} data-tip="Zoom in<br><span class='shortcut'>(Ctrl+Mouse Wheel)</span>"><i className="icon-zoom-in"/></a></li>
          <li><a href="#" onClick={this.getCallback('onZoomOut')} data-tip="Zoom out<br><span class='shortcut'>(Ctrl+Mouse Wheel)</span>"><i className="icon-zoom-out"/></a></li>
          {/*<li><a href="#" onClick={this.getCallback('onContain')}><i className="fa fa-arrows-alt"/></a></li>*/}
        </ul>
        <ul className={styles.left}>
          <li className={this.props.cursorMode == CursorMode.MULTISELECT ? styles.active : ''}><a href="#" onClick={this.getCallback('onMultiselectMode', true)} data-tip="Selection mode"><i className="icon-cursor"/></a></li>
          <li className={this.props.cursorMode == CursorMode.PAN  ? styles.active : ''}><a href="#" onClick={this.getCallback('onPanMode', true)} data-tip="Panning mode"><i className="icon-hand"/></a></li>
          <li><a href="#" data-tip="Group nodes"><i className="fa fa-object-group"/></a></li>
        </ul>

        <ul className={styles.right}>
          <li className={this.props.showCodeView ? styles.active : ''}><a href="#" onClick={this.getCallback('onCodeViewToggle')}  data-tip="Display/hide code view"><i className="icon-code"/></a></li>
          {/*<li><a href="#" data-tip="Settings"><i className="icon-settings"/></a></li>*/}
        </ul>

        {execItems}
        <Tooltip place="bottom" type="dark" effect="solid" delayShow={850} className={styles.tooltip} offset={{'top': -13, 'left': -10}} html={true}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currentFileIndex = state.getIn('files.active'.split('.'));
  return {
    currentFileIndex: currentFileIndex,
    adapter: state.getIn(['files', 'opened', currentFileIndex, 'adapter']),
    showCodeView: state.getIn('ui.showCodeView'.split('.')),
    showExecutionReporter: state.getIn('ui.showExecutionReporter'.split('.')),
    cursorMode: state.getIn(['ui', 'cursorMode']),
    isExecutionRunning: state.getIn('ui.isExecutionRunning'.split('.')),
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
    onSaveImage: () => {
      dispatch(uiActions.saveImage())
    },
    onOpen: () => {
      dispatch(fileActions.open())
    },
    onNew: () => {
      dispatch(uiActions.showNewFileModal())
    },
    onExecutionStart: () => {
      dispatch(uiActions.startExecution())
    },
    onExecutionTermination: () => {
      dispatch(uiActions.terminateExecution())
    },
    onOpenExecConfs: () => {
      dispatch(uiActions.showExecConfsModal())
    },
    onToggleExecutionReporter: () => {
      dispatch(uiActions.toggleEXecutionReporter())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
