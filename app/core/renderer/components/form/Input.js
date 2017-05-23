// @flow
import React, {Component} from 'react';
import Tooltip from 'react-tooltip';

import styles from './Input.scss';

export default class Input extends Component {
  render() {
    let help = '';
    if(this.props.help){
      help = (
        <span>
          <i className={"fa fa-question-circle help-icon"} data-tip={this.props.help}/>
          <Tooltip place="right" type="dark" effect="solid" delayShow={100} className="help-tooltip" html={true}/>
        </span>
      )
    }


    let label = '';
    if(this.props.label){
      label = (
        <div className="label-wrapper">
          <label>{this.props.label}</label>
          {help}
        </div>
      )
    }

    let error = '';
    if(this.props.error){
      error = (
        <div className="error-wrapper">{this.props.error}</div>
      )
    }

    const properties = {
      disabled: this.props.disabled,
      required: this.props.required,
    };

    if(this.props.onChange) properties.onChange = this.props.onChange;
    if(this.props.name) properties.name = this.props.name;
    if(this.props.placeholder) properties.placeholder = this.props.placeholder;

    return (
      <div className={styles.container + (this.props.error ? ' error ' + styles.error : '') + (this.props.className ? ' ' + this.props.className : '')}>
        {label}
        <div className="input-wrapper">
          <input value={this.props.value} type={this.props.type} {...properties} />
        </div>
        {error}
      </div>
    );
  }
}

Input.defaultProps = {
  type: "text",
  value: "",
  required: false,
  disabled: false
};

Input.propTypes = {
  className: React.PropTypes.string,
  label: React.PropTypes.string,
  name: React.PropTypes.string,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  help: React.PropTypes.string,
  type: React.PropTypes.string,
  error: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  required: React.PropTypes.bool,
  onChange: React.PropTypes.func,
};
