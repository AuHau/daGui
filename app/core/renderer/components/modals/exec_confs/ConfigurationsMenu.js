// @flow
import React, {Component} from 'react';

import styles from './ConfigurationsMenu.scss';

export default class ConfigurationsMenu extends Component {
  constructor(props){
    super(props);

    this.onDeleteConf = this.onDeleteConf.bind(this);
  }

  onDeleteConf(){
    if(this.props.active !== null){
      this.props.onDelete(this.props.active);
    }
  }

  render() {
    const list = this.props.configurations ? Object.keys(this.props.configurations).sort().map(name => (<li key={name}><a href="#" className={(this.props.active == name ? styles.active : '')} onClick={() => this.props.onSelection(name)}>{name}</a></li>)) : "";

    return (
      <div className={styles.container}>
        <div className={styles.actionBar}>
          <a href="#" className={styles.add} onClick={() => this.props.onCreate()}><i className="fa fa-plus"/></a> <a href="#" className={styles.delete + (this.props.active ? '' : ' ' + styles.disabled)} onClick={this.onDeleteConf}><i className="fa fa-minus"/></a>
        </div>
        <ul className={styles.listing}>
          {list}
        </ul>
      </div>
    );
  }
}

ConfigurationsMenu.propTypes = {
  active: React.PropTypes.string,
  configurations: React.PropTypes.object.isRequired,
  onSelection: React.PropTypes.func.isRequired,
  onCreate: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired
};
