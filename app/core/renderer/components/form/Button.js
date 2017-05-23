// @flow
import React, {Component} from 'react';

import styles from './Button.scss';

export default class Button extends Component {
  render() {
    const properties = {
      disabled: this.props.disabled,
    };

    if(this.props.onClick) properties.onClick = this.props.onClick;

    return (
      <span className={styles.container + (this.props.className ? ' ' + this.props.className : '')}>
          <button className={this.props.type} {...properties}>{this.props.children}</button>
      </span>
    );
  }
}

export const ButtonTypes = {
  DEFAULT: 'default',
  PRIMARY: 'primary'
};

Button.defaultProps = {
  type: ButtonTypes.DEFAULT,
  disabled: false
};

Button.propTypes = {
  className: React.PropTypes.string,
  type: React.PropTypes.oneOf(Object.values(ButtonTypes)),
  disabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
};
