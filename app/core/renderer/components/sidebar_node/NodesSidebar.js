// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './NodesSidebar.scss';

import NodesGroup from './NodesGroup';

// TODO: Rework for adapter specified in future File
import SparkAdapter from '../../../../adapters/spark';

export default class NodesSidebar extends Component {
  render() {
    const groups = SparkAdapter.getGroupedNodeTemplates();
    const renderedGroups = groups.map((group, index) => <NodesGroup key={index} name={group.name} nodes={group.nodes} />);

    return (
      <div className={styles.container}>
        {renderedGroups}
      </div>
    );
  }
}
