// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scrollbar from 'react-scrollbar/dist/no-css';
import Toggle from 'material-ui/Toggle';

import styles from './NodesSidebar.scss';
import NodesGroup from './NodesGroup';

export default class NodesSidebar extends Component {

  constructor(props){
    super(props);

    this.state = {
      searchedText: '',
      showHiddenNodes: false
    };

    this.onHiddenNodesToggle = this.onHiddenNodesToggle.bind(this);
  }

  onSearch(e){
    this.setState({searchedText: e.target.value});
  }

  onHiddenNodesToggle(e, toggled){
    this.setState({showHiddenNodes: toggled});
  }

  componentDidMount(){
    const input = ReactDOM.findDOMNode(this.refs.searchInput);

    input.addEventListener('input', this.onSearch.bind(this));
  }

  render() {
    // Only when file is opened
    let renderedGroups;
    if(this.props.adapter) {

      // TODO: [Low] getGroupedNodeTemplates does not needs to be implemented ==> in such a case use getNodeTemplates instead.
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
              <Toggle
                style={{fontSize: 13, lineHeight: 20}}
                label="Display hidden nodes"
                labelPosition="right"
                toggled={this.state.showHiddenNodes}
                onToggle={this.onHiddenNodesToggle}
              />
            </label>
          </div>
        </div>
        <Scrollbar className={styles.nodeList} horizontal={false}>
          {renderedGroups}
        </Scrollbar>
      </div>
    );
  }
}

NodesSidebar.propTypes = {
  adapter: React.PropTypes.func
};
