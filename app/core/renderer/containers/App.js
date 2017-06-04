// @flow
import React, {Component} from 'react';
import { connect } from 'react-redux';
import joint from 'jointjs';
import Immutable from 'immutable';
import {generateCode, validateGraph} from 'graph/graphToolkit.js';
import CodeBuilder from 'graph/CodeBuilder';
import ExecutionConfigurationsWell from 'renderer/wells/ExecutionConfigurationsWell';

// Enums
import ErrorType from 'shared/enums/ErrorType';
import ErrorLevel from 'shared/enums/ErrorLevel';
import HighlightType, {classTranslation as highlightTypeClasses} from 'shared/enums/HighlightType';
import HighlightDestination, {values as HighlightDestinations} from 'shared/enums/HighlightDestination';

// Actions
import {updateNode, updateVariable} from 'shared/actions/graph';
import {switchTab, close} from 'shared/actions/file';
import * as uiActions from "../../shared/actions/ui";

// Components
import ToggleDisplay from 'react-toggle-display';
import Menu from 'renderer/components/layout/Menu';
import Tabs from 'renderer/components/layout/Tabs';
import Footer from 'renderer/components/layout/Footer';
import NodesSidebar from 'renderer/components/sidebar_node/NodesSidebar';
import DetailSidebar from 'renderer/components/sidebar_detail/DetailSidebar';
import Canvas from 'renderer/components/editor/Canvas';
import CodeView from 'renderer/components/editor/CodeView';
import ExecutionReporter from 'renderer/components/editor/execution_reporter/ExecutionReporter';
import Modals, {modalsList} from 'renderer/components/modals/Modals';
import NoFilesOpened from 'renderer/components/editor/NoFilesOpened';
import Dialog from 'material-ui/Dialog';
import Button from 'renderer/components/form/Button';

// TODO: [High] Import of system libraries (Math etc) when used. Most probably implement "hasLibrary" on platform adapter, which will query the platform for available libraries
// TODO: [Low] Import of user's libraries. Enable user to import his custom libraries
// TODO: []
class App extends Component {
  constructor(props){
    super(props);

    const highlights = {};
    for(let val of HighlightDestinations){
      highlights[val] = [];
    }
    this.highlightsTemplate = Immutable.fromJS(highlights);

    this.state = {
      highlights: this.highlightsTemplate,
      showDialog: false,
      dialogMsg: '',
      isExecutionRunning: false,
      executionCode: null,
      refreshConfs: false
    };

    this.codeBuilder = new CodeBuilder();
    this.graphErrors = [];
    this.graphHash = null;
    this.addHighlight = this.addHighlight.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.switchHighlight = this.switchHighlight.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.refreshExecConfs = this.refreshExecConfs.bind(this);
  }

  changeTab(newIndex){
    this.resetHighlights();
    this.props.onTabChange(newIndex);
    this.graphHash = null;
  }

  closeTab(index){
    this.resetHighlights();
    this.props.onTabClose(index);
    this.graphHash = null;
  }

  addHighlight(nid, type, destination){
    if(type != HighlightType.ERROR && this.graphErrors && this.graphErrors.length > 0) return;

    this.setState({ highlights: this.state.highlights.set(destination, this.state.highlights.get(destination).push({nid, type})) })
  }

  removeHighlight(nid, type, destination){
    if(type != HighlightType.ERROR && this.graphErrors && this.graphErrors.length > 0) return;

    this.setState({ highlights: this.state.highlights.set(destination, this.state.highlights.get(destination).filter(highlight => highlight.nid !== nid || highlight.type !== type )) })
  }

  switchHighlight(oldNid, newNid, type, destination){
    this.setState({ highlights: this.state.highlights.set(destination, this.state.highlights.get(destination).filter(highlight => highlight.nid !== oldNid || highlight.type !== type ).push({nid: newNid, type})) })
  }

  resetHighlights(){
    this.setState({highlights: this.highlightsTemplate});
  }

  componentWillReceiveProps(nextProps){
    const currentFile = nextProps.files.get(nextProps.currentFileIndex);

    this.handleCodeGeneration(currentFile, nextProps);
    this.handleExecution(currentFile, nextProps);
  }

  handleCodeGeneration(currentFile, nextProps){
    // When no file is opened don't validate the graph & generate the code
    if(nextProps.currentFileIndex < 0) return;

    if(currentFile.getIn(['history', 'present', 'cells']).isEmpty()){ // Graph is empty => nothing to check
      if(this.graphErrors.length){ // There were errors before => delete them
        this.resetHighlights();
        this.graphErrors = [];
      }

      return;
    }

    const validationResult = validateGraph(currentFile, this.graphHash);

    if(validationResult == null) { // Hashes matches ==> No regeneration
      return;
    }else if(validationResult.errors && validationResult.errors.length){ // New errors
      this.graphErrors = validationResult.errors;
      this.highlightErrors();
      this.graphHash = validationResult.hash;

      return;
    }else if(this.graphErrors && (!validationResult.errors || !validationResult.errors.length)){ // No errors => have to delete the current ones
      this.resetHighlights();
      this.graphErrors = [];
    }

    if(!nextProps.showCodeView){
      return; // When code is not displayed, it is not needed to regenerate it.
    }

    const result = generateCode(this.codeBuilder, currentFile, null, this.graphHash, true);

    if(!result.success){
      this.graphErrors = result.errors;
      this.highlightErrors();
    }else if(this.graphErrors.length){
      this.resetHighlights();
      this.graphErrors = [];
    }
    this.graphHash = result.hash;
  }

  async handleExecution(currentFile, nextProps){
    if(!this.props.isExecutionRunning && nextProps.isExecutionRunning){ // Start of execution
      // When no file is opened don't launch the execution
      if(nextProps.currentFileIndex < 0){
        this.props.onTerminateExecution(true);
        return Promise.resolve();
      }

      if(this.graphErrors.length){ // Don't allow execution of file with errors
        this.openDialog("The current file contains errors! It is not possible to execute a file which contains errors, please fix them and then try again.");
        this.props.onTerminateExecution(true);
        return Promise.resolve();
      }

      if(currentFile.getIn(['history', 'present', 'cells']).isEmpty()) { // Graph is empty => nothing to execute
        this.openDialog("The current file is empty! You can not execute empty file!");
        this.props.onTerminateExecution(true);
        return Promise.resolve();
      }

      const execConf = await ExecutionConfigurationsWell.getActiveConfiguration(currentFile.get('adapter').getId())
      const tempCodeBuilder = new CodeBuilder();
      const result = generateCode(tempCodeBuilder, currentFile, execConf);

      if(!result.success){
        this.graphErrors = result.errors;
        this.highlightErrors();
      }else{
        this.setState({
          isExecutionRunning: true,
          executionCode: tempCodeBuilder.getCode()
        });
      }
    }else if(this.props.isExecutionRunning && !nextProps.isExecutionRunning){
      this.setState({isExecutionRunning: false});
    }
  }

  highlightErrors(){
    const errHighlights = this.highlightsTemplate.asMutable();
    for(let err of this.graphErrors){
      if(err.id){
        errHighlights.set(HighlightDestination.CANVAS, this.state.highlights.get(HighlightDestination.CANVAS).push({nid: err.id, type: HighlightType.ERROR}));
      }
    }

    this.setState({highlights: errHighlights.asImmutable()});
  }

  openDialog(msg){
    this.setState({showDialog: true, dialogMsg: msg});
  }

  closeDialog(){
    this.setState({showDialog: false, dialogMsg: ''});
  }

  refreshExecConfs(){
    this.setState({refreshConfs: true});
  }

  componentDidUpdate(){
    if(this.state.refreshConfs){
      this.setState({refreshConfs: false});
    }
  }

  render() {
    let $currentFile, adapter, adapterName, language, languageName;
    if(this.props.currentFileIndex >= 0){
      $currentFile = this.props.files.get(this.props.currentFileIndex);
      adapter = $currentFile.get('adapter');
      adapterName = adapter.getName();
      language = $currentFile.get('language');
      languageName = language.getName();
    }

    return (
      <div>
        <Menu refreshConfs={this.state.refreshConfs} />
        <NodesSidebar ref={(n) => {this.refSidebar = n}} adapter={adapter} />
        <Tabs currentFileIndex={this.props.currentFileIndex} $files={this.props.files} onTabClose={this.closeTab} onTabChange={this.changeTab}/>

        <Canvas
          onAddHighlight={this.addHighlight}
          onRemoveHighlight={this.removeHighlight}
          onSwitchHighlight={this.switchHighlight}
          highlights={this.state.highlights.get(HighlightDestination.CANVAS)}/>

        <ToggleDisplay show={this.props.currentFileIndex < 0}><NoFilesOpened/></ToggleDisplay>

        <ToggleDisplay show={this.props.nodeDetail !== null}>
          <DetailSidebar
            node={(this.props.nodeDetail ? this.props.nodeDetail.toJS() : null)}
            language={language}
            adapter={adapter}
            onNodeChange={this.props.onNodeChange}/>
        </ToggleDisplay>

        <ToggleDisplay show={this.props.showCodeView}>
          <CodeView
            onAddHighlight={this.addHighlight}
            onRemoveHighlight={this.removeHighlight}
            highlights={this.state.highlights.get(HighlightDestination.CODE_VIEW)}
            language={language}
            codeBuilder={this.codeBuilder}
            errors={this.graphErrors}
            onVariableNameChange={this.props.onVariableChange}/>
        </ToggleDisplay>

        <ToggleDisplay show={this.props.showExecutionReporter}>
          <ExecutionReporter
            isExecutionRunning={this.state.isExecutionRunning}
            adapter={adapter}
            generatedCode={this.state.executionCode}
            onTerminateExecution={this.props.onTerminateExecution}/>
        </ToggleDisplay>

        <Footer messages={this.graphErrors} framework={adapterName} language={languageName}/>

        {/*Invisible components*/}
        <Modals openedModals={this.props.modals} onClose={this.props.onModalClose} refreshExecConfs={this.refreshExecConfs} />
        <Dialog
          open={this.state.showDialog}
          onRequestClose={this.closeDialog}
          actions={[<Button onClick={this.closeDialog}>Ok</Button>]}
        >{this.state.dialogMsg}</Dialog>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const modals = [];
  if(state.getIn(['ui', 'displayNewFileModal']))
    modals.push(modalsList.NEW_FILE);

  if(state.getIn(['ui', 'displayExecConfsModal']))
    modals.push(modalsList.EXEC_CONFS);

  const nodeId = state.getIn(['ui', 'detailNodeId']);
  const activeFile = state.getIn(['files', 'active']);

  return {
    currentFileIndex: activeFile,
    files: state.getIn(['files', 'opened']),
    nodeDetail: (nodeId && activeFile >= 0 ? state.getIn(['files', 'opened', activeFile, 'history', 'present', 'cells']).find(node => node.get('id') == nodeId) : null),
    showCodeView: state.getIn('ui.showCodeView'.split('.')),
    isExecutionRunning: state.getIn('ui.isExecutionRunning'.split('.')),
    showExecutionReporter: state.getIn('ui.showExecutionReporter'.split('.')),
    modals: modals
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNodeChange: (node) => dispatch(updateNode(node)),
    onVariableChange: (nid, newVariableName) => dispatch(updateVariable(nid, newVariableName)),
    onTabChange: (newIndex) => dispatch(switchTab(newIndex)),
    onTerminateExecution: (closeReporter) => dispatch(uiActions.terminateExecution(closeReporter)),
    onModalClose: (modal) => {
      switch(modal){
        case modalsList.NEW_FILE:
          dispatch(uiActions.hideNewFileModal());
          break;
        case modalsList.EXEC_CONFS:
          dispatch(uiActions.hideExecConfsModal());
          break;
      }
    },
    onTabClose: (index) => dispatch(close(index))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
