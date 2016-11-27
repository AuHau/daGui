// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux'
import styles from './NodesSidebar.scss';

import NodesGroup from './NodesGroup';

class NodesSidebar extends Component {
  render() {
    const groups = this.props.adapter.getGroupedNodeTemplates();
    const renderedGroups = groups.map((group, index) => <NodesGroup key={index} name={group.name} nodes={group.nodes} />);

    return (
      <div className={styles.container}>
        {renderedGroups}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
      return {
        adapter: state.files.opened[state.files.active].adapter
      };
};

export default connect(mapStateToProps)(NodesSidebar);
