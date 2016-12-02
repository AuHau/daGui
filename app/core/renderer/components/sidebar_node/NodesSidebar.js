// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './NodesSidebar.scss';

import NodesGroup from './NodesGroup';

export default class NodesSidebar extends Component {

  constructor(props){
    super(props);

    this.state = {searchedText: ''};
  }

  onSearch(e){
    this.setState({searchedText: e.target.value});
  }

  componentDidMount(){
    const input = ReactDOM.findDOMNode(this.refs.searchInput);
    input.addEventListener('input', this.onSearch.bind(this));
  }

  render() {
    const groups = this.props.adapter.getGroupedNodeTemplates();
    const renderedGroups = groups.map((group, index) => <NodesGroup key={index} name={group.name} nodes={group.nodes} searchedText={this.state.searchedText} />);

    return (
      <div className={styles.container}>
        <div className={styles.search}>
          <input type="search" placeholder="Search node" ref="searchInput"/>
        </div>
        <div className={styles.nodeList}>
          {renderedGroups}
        </div>
      </div>
    );
  }
}

NodesSidebar.propTypes = {
  adapter: React.PropTypes.func.isRequired
};
