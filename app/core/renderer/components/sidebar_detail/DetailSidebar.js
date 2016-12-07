// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CodeInput from '../editor/CodeInput';
import styles from './DetailSidebar.scss';


export default class DetailSidebar extends Component {

  constructor(props){
    super(props);

    this.nodeTemplate = this.props.adapter.getNodeTemplates()[this.props.node.type];
  }

  // TODO: With Node's title change, the text might not fit the node ==> node resize?
  onNameChange(e){
    const node = this.props.node;
    const newTitle = e.target.value;

    node.dfGui.title = newTitle;
    this.nodeTemplate.changeTitle(node, newTitle);

    this.props.onNodeChange(node);
  }

  componentDidMount(){
    const nameInput = ReactDOM.findDOMNode(this.refs.nameInput);
    nameInput.addEventListener('change', this.onNameChange.bind(this));
    nameInput.addEventListener('blur', (e) => {e.stopPropagation()});
  }

  componentWillReceiveProps(newProps){
    // Before updating the input, I have to check if the Node's title was changed
    const nameInput = ReactDOM.findDOMNode(this.refs.nameInput);
    if(this.props.node.dfGui.title != nameInput.value){
      nameInput.blur(); // Blur will fire the change event
    }

    this.nodeTemplate = newProps.adapter.getNodeTemplates()[newProps.node.type];
  }

  componentDidUpdate(){
    const nameInput = ReactDOM.findDOMNode(this.refs.nameInput);
    nameInput.value = this.props.node.dfGui.title;
  }

  render() {
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
      <div className={styles.container}>
        <div>
          <strong>Node type: </strong>
          {this.nodeTemplate.getName()}
        </div>
        <div>
          <strong>Node title: </strong>
          <input type="text" defaultValue={this.props.node.dfGui.title} ref="nameInput"/>
        </div>
        {codeInput}
      </div>
    );
  }
}

DetailSidebar.propTypes = {
  node: React.PropTypes.object.isRequired,
  adapter: React.PropTypes.func.isRequired,
  language: React.PropTypes.func.isRequired,
  onNodeChange: React.PropTypes.func.isRequired
};
