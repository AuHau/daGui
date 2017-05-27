// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Resizable from 'renderer/components/utils/Resizable';
import CodeInput from 'renderer/components/editor/CodeInput';
import styles from './DetailSidebar.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';
import Scrollbar from 'react-scrollbar/dist/no-css';

const detailSidebarWidth = parseInt(cssVariables.detailSidebarWidth);

export default class DetailSidebar extends Component {

  shouldComponentUpdate(nextProps){
    return nextProps.node !== null && nextProps.node !== undefined;
  }

  componentWillUpdate(newProps){
    if(!newProps.node) return;

    this.nodeTemplate = newProps.adapter.getNodeTemplates()[newProps.node.type];
  }

  getMaxWidth(){
    return document.documentElement.clientWidth - detailSidebarWidth;
  }

  render() {
    if(!this.nodeTemplate)
      return (<div></div>);

    let codeInput;
    if (this.nodeTemplate.getCodeParameters() !== null) {
      codeInput = (
        <div>
          <div style={{paddingLeft: '15px'}}>
            <strong>Code definition:</strong>
          </div>
          <Scrollbar horizontal={false}>
            <CodeInput
              node={this.props.node}
              language={this.props.language}
              nodeTemplate={this.nodeTemplate}
              onNodeChange={this.props.onNodeChange}/>
          </Scrollbar>
        </div>
      );
    }

    return (
      <Resizable side={"left"} class={styles.container} wrapperClass={styles.wrapper} getMax={this.getMaxWidth}>
        <div className={styles.padding}>
          <h3>Node's detail</h3>
          <div>
            <strong>Node type: </strong>
            {this.nodeTemplate.getName()}
          </div>
        </div>
        {codeInput}
      </Resizable>
    );
  }
}

DetailSidebar.propTypes = {
  node: React.PropTypes.object,
  adapter: React.PropTypes.func,
  language: React.PropTypes.func,
  onNodeChange: React.PropTypes.func.isRequired
};
