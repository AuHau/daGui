// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import selectRange from 'shared/utils/selectRange';

import styles from './CodeInput.scss';


export default class CodeInput extends Component {

  static mapParameter(parameter, index){
    const parameterClass = (parameter.required ? styles.required : styles.optional);

    return (<div data-parameter={index} key={index} className={parameterClass} suppressContentEditableWarning={true} contentEditable="true">{parameter.template}</div>);
  }

  onMouseUp(e){
    const elem = e.target;
    if(!elem.dataset.parameter){
      const firstOption = ReactDOM.findDOMNode(this.refs.container).querySelectorAll('.' + styles.parameter)[0];
      const firstParameter = this.props.nodeTemplate.getCodeParameters()[0];
      selectRange(firstOption, firstParameter.selectionStart, firstParameter.selectionEnd);
    }
  }

  onKeyDown(e){
    if(e.keyCode == 9) {
      const next = e.target.nextElementSibling;
      if(next && next.dataset.parameter){
        const parameter = this.props.nodeTemplate.getCodeParameters()[next.dataset.parameter];
        selectRange(next, parameter.selectionStart, parameter.selectionEnd);
      }else{
        const container = ReactDOM.findDOMNode(this.refs.container);
        const firstOption = container.querySelectorAll('.' + styles.parameter)[0];
        const parameter = this.props.nodeTemplate.getCodeParameters()[0];
        selectRange(firstOption, parameter.selectionStart, parameter.selectionEnd);
      }

      e.preventDefault();
    }
  }

  componentDidMount(){
    const container = ReactDOM.findDOMNode(this.refs.container);

    container.addEventListener('mouseup', this.onMouseUp.bind(this));
    container.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  render(){
    const parameters = this.props.nodeTemplate.getCodeParameters().map(CodeInput.mapParameter);

    return (
      <div ref="container" className={styles.container}>
        <div className={styles.nodesCode}>.{this.props.nodeTemplate.getCodePrefix()}</div>
        {parameters}
        <div className={styles.nodesCode}>{this.props.nodeTemplate.getCodeSuffix()}</div>
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
