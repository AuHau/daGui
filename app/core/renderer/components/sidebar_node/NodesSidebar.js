// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './NodesSidebar.scss';

import NodesGroup from './NodesGroup';

export default class NodesSidebar extends Component {

  constructor(props){
    super(props);

    this.state = {
      searchedText: '',
      showHiddenNodes: false
    };
  }

  onSearch(e){
    this.setState({searchedText: e.target.value});
  }

  onHiddenNodesToggle(e){
    this.setState({showHiddenNodes: !this.state.showHiddenNodes});
  }

  componentDidMount(){
    const input = ReactDOM.findDOMNode(this.refs.searchInput);

    input.addEventListener('input', this.onSearch.bind(this));
  }

  render() {
    // Only when file is opened
    let renderedGroups;
    if(this.props.adapter) {

      const groups = this.props.adapter.getGroupedNodeTemplates();
      renderedGroups = groups.map((group, index) => <NodesGroup key={index}
                                                                      displayHiddenNodes={this.state.showHiddenNodes}
                                                                      name={group.name} nodeTemplates={group.templates}
                                                                      searchedText={this.state.searchedText}/>);
    }

    // TODO: [Medium] Filter type of nodes (i.e. only for RDD, only for DF, all, etc.)
    // TODO: [Low] Collapse groups
    return (
      <div className={styles.container}>
        <div className={styles.search}>
          <div>
            <input type="search" placeholder="Search node" ref="searchInput"/>
          </div>
          <div>
            <label>
              <input type="checkbox" checked={this.state.showHiddenNodes} onChange={this.onHiddenNodesToggle.bind(this)}/>
              Display hidden nodes
            </label>
          </div>
        </div>
        <div className={styles.nodeList}>
          {renderedGroups}
        </div>
      </div>
    );
  }
}

NodesSidebar.propTypes = {
  adapter: React.PropTypes.func
};
