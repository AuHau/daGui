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
  }

  render(){

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
        <div>
          <strong>Code definition:</strong>
        </div>
        <CodeInput node={this.props.node} nodeTemplate={this.nodeTemplate} onNodeChange={this.props.onNodeChange}/>
      </div>
    );
  }
}

DetailSidebar.propTypes = {
  node: React.PropTypes.object.isRequired,
  adapter: React.PropTypes.func.isRequired,
  onNodeChange: React.PropTypes.func.isRequired
};
