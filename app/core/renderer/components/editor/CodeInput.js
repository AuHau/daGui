// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import selectRange from 'shared/utils/selectRange';

import styles from './CodeInput.scss';
import Tooltip from 'react-tooltip';


export default class CodeInput extends Component {

  mapParameter(parameter, index){
    const parameterClass = (parameter.required ? styles.required : styles.optional);
    const isParameterValueTemplate = this.props.node.dfGui.parameters
                                      && (this.props.node.dfGui.parameters[index] == undefined || this.props.node.dfGui.parameters[index] == parameter.template);
    const templateClass =  isParameterValueTemplate ? ' ' + styles.template : '';
    const parameterValue = isParameterValueTemplate ? parameter.template : this.props.node.dfGui.parameters[index];

    const params = {};
    if(parameter.description){
      params['data-tip'] = parameter.description;
    }

    return (<div {...params} data-parameter={index} key={this.props.node.id + '_' + index} className={parameterClass + templateClass} suppressContentEditableWarning={true} contentEditable="true">{parameterValue}</div>);
  }

  onBlur(e){
    const parameters = this.props.node.dfGui.parameters;
    const index = e.target.dataset.parameter;
    const parameterValue = e.target.textContent;

    if(!parameters || !parameters[index] || parameters[index] != parameterValue){
      const newNode = this.props.node; // TODO: [Q] Not deep clonning - problem?

      if(!parameters) newNode.dfGui.parameters = [];
      newNode.dfGui.parameters[index] = parameterValue;
      this.props.onNodeChange(newNode);
    }
  }

  onMouseUp(e){
    const elem = e.target;
    if(!elem.dataset.parameter){
      const firstOption = ReactDOM.findDOMNode(this.refs.container).querySelectorAll('.' + styles.parameter)[0];
      const firstParameter = this.props.nodeTemplate.getCodeParameters()[0];
      if (firstParameter.selectionStart && firstParameter.selectionEnd)
        selectRange(firstOption, firstParameter.selectionStart, firstParameter.selectionEnd);
    }
  }

  onKeyDown(e){
    if(e.keyCode == 9) { // Tab
      const next = e.target.nextElementSibling;
      if(next && next.dataset.parameter){
        const parameter = this.props.nodeTemplate.getCodeParameters()[next.dataset.parameter];
        if (parameter.selectionStart && parameter.selectionEnd)
          selectRange(next, parameter.selectionStart, parameter.selectionEnd);
      }else{
        const container = ReactDOM.findDOMNode(this.refs.container);
        const firstOption = container.querySelectorAll('.' + styles.parameter)[0];
        const parameter = this.props.nodeTemplate.getCodeParameters()[0];
        if (parameter.selectionStart && parameter.selectionEnd)
          selectRange(firstOption, parameter.selectionStart, parameter.selectionEnd);
      }

      e.preventDefault();
    }else if(e.keyCode == 39){ // Right arrow
      window.getSelection().modify("move", "right", "character"); // TODO: [Medium] Rework the CodeInput with proper contenteditable implementation for React, because it is blocking cursor moving. Remove the hackhish fix.
    }else if(e.keyCode == 37){ // Left arrow
      window.getSelection().modify("move", "left", "character");
    }
  }

  componentWillUpdate(nextProps){
    if(this.props.node.id != nextProps.node.id){
      this.rebindInputs = true;
      const container = ReactDOM.findDOMNode(this.refs.container);
      container.querySelectorAll('.' + styles.parameter).forEach((parameterNode) => parameterNode.blur());
    }
  }

  componentDidUpdate(){
    if(this.rebindInputs){
      this.bindEventsToInput();
      this.rebindInputs = false;
      // Tooltip.rebuild(); // TODO: [Medium] Better solution for refreshing the tooltips.
    }
  }

  bindEventsToInput(){
    const container = ReactDOM.findDOMNode(this.refs.container);
    container.querySelectorAll('.' + styles.parameter).forEach((parameterNode) => parameterNode.addEventListener('blur', this.onBlur.bind(this)));
  }

  componentDidMount(){
    const container = ReactDOM.findDOMNode(this.refs.container);
    container.addEventListener('mouseup', this.onMouseUp.bind(this));
    container.addEventListener('keydown', this.onKeyDown.bind(this));
    this.bindEventsToInput();
  }

  render(){
    const parameters = this.props.nodeTemplate.getCodeParameters().map(this.mapParameter.bind(this));

    return (
      <div ref="container" className={styles.container}>
        <div className={styles.nodesCode}>.{this.props.nodeTemplate.getCodePrefix()}</div>
        {parameters}
        <div className={styles.nodesCode}>{this.props.nodeTemplate.getCodeSuffix()}</div>
        {/*<Tooltip place="left" type="dark" effect="solid" delayShow={450} className={styles.tooltip} html={true}/>*/}
      </div>
    );
  }
}

CodeInput.propTypes = {
  node: React.PropTypes.object.isRequired,
  nodeTemplate: React.PropTypes.func.isRequired,
  language: React.PropTypes.func.isRequired,
  onNodeChange: React.PropTypes.func.isRequired
};
