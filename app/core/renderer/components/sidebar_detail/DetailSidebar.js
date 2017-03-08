// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Resizable from 'renderer/components/utils/Resizable';
import CodeInput from 'renderer/components/editor/CodeInput';
import styles from './DetailSidebar.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

const detailSidebarWidth = parseInt(cssVariables.detailSidebarWidth);

export default class DetailSidebar extends Component {

  constructor(props){
    super(props);

    this.listenersAttached = false;
  }

  onNameChange(e){
    const node = this.props.node;

    node.dfGui.description = e.target.value;

    this.props.onNodeChange(node);
  }

  attacheListeners(){
    const descriptionInput = ReactDOM.findDOMNode(this.refs.descriptionInput);
    descriptionInput.addEventListener('change', this.onNameChange.bind(this));
    descriptionInput.addEventListener('blur', (e) => {e.stopPropagation()});
    this.listenersAttached = true;
  }

  shouldComponentUpdate(nextProps){
    return nextProps.node !== null && nextProps.node !== undefined;
  }

  componentWillUpdate(newProps){
    // Before updating the input, I have to check if the Node's description was changed
    const descriptionInput = ReactDOM.findDOMNode(this.refs.descriptionInput);
    if(this.props.node && descriptionInput && this.props.node.dfGui.description != descriptionInput.value){
      descriptionInput.blur(); // Blur will fire the change event
    }

    this.nodeTemplate = newProps.adapter.getNodeTemplates()[newProps.node.type];
  }

  componentDidUpdate(){
    if(!this.listenersAttached){
      this.attacheListeners()
    }

    const descriptionInput = ReactDOM.findDOMNode(this.refs.descriptionInput);
    descriptionInput.value = this.props.node.dfGui.description;
  }

  getMaxWidth(){
    return document.documentElement.clientWidth - detailSidebarWidth;
  }

  render() {
    if(!this.nodeTemplate)
      return (<div></div>);

    let codeInput;
    if (this.nodeTemplate.hasCodeToFill()) {
      codeInput = (
        <div>
          <div>
            <strong>Code definition:</strong>
          </div>
          <CodeInput node={this.props.node} language={this.props.language} nodeTemplate={this.nodeTemplate}
                     onNodeChange={this.props.onNodeChange}/>
        </div>
      );
    }

    return (
      <Resizable side={"left"} class={styles.container} getMax={this.getMaxWidth}>
        <div>
          <strong>Node type: </strong>
          {this.nodeTemplate.getName()}
        </div>
        <div>
          <strong>Node's description: </strong>
          <input type="text" defaultValue={this.props.node.dfGui.description} ref="descriptionInput"/>
        </div>
        {codeInput}
      </Resizable>
    );
  }
}

DetailSidebar.propTypes = {
  node: React.PropTypes.object,
  adapter: React.PropTypes.func.isRequired,
  language: React.PropTypes.func.isRequired,
  onNodeChange: React.PropTypes.func.isRequired
};
