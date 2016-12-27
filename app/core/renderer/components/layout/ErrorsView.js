// @flow
import React, {Component} from 'react';

import levels, {classTranslation, textTranslation} from '../../../shared/enums/ErrorLevel.js';
import styles from './ErrorsView.scss';

const MESSAGES_CYCLE = 4000;

export default class ErrorsView extends Component {

  constructor(props){
    super(props);

    this.state = {
      activeMessage: 0,
      showDetailWindow: false,
    };

    this.interval = null;
    this.onClick = this.onClick.bind(this);
  }

  initInterval(){
    if(this.props.messages.length > 1){
      this.interval = setInterval(() => {
        this.setState({
          activeMessage: (this.state.activeMessage + 1 >= this.props.messages.length ? 0 : this.state.activeMessage + 1)
        })
      }, MESSAGES_CYCLE);
    }
  }

  componentDidMount(){
    this.initInterval();
  }

  componentDidUpdate(){
    clearInterval(this.interval);
    this.initInterval();
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.messages.length){
      this.setState({showDetailWindow: false});
    }
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  onClick(){
    if(this.getClass() == styles.ok) return;

    this.setState({showDetailWindow: !this.state.showDetailWindow});
  }

  getClass() {
    if (this.props.messages.find(msg => msg.level == levels.VARIABLE) != null)
      return styles.error;

    if (this.props.messages.find(msg => msg.level == levels.NODE) != null)
      return styles.warning;

    if (this.props.messages.find(msg => msg.level == levels.INFO) != null)
      return styles.info;

    return styles.ok;
  }

  render() {
    let renderedErrors, detailedErrors;
    if(this.props.messages.length == 1){
      const err = this.props.messages[0];
      renderedErrors = (<div className={styles.message + ' ' + styles[classTranslation[err.level]] + ' ' + styles.in}>{err.description}</div>);
      detailedErrors = (<div className={styles[classTranslation[err.level]]}><strong>{textTranslation[err.level]}:</strong> {err.description}</div>);
    }else{
      const orderedErrors = this.props.messages.sort((a, b) => b.importance - a.importance);
      renderedErrors = orderedErrors
        .map((err, index) => {
          const msgClass = styles.message + ' ' + styles[classTranslation[err.level]] + ' '
            + (this.state.activeMessage == index ? styles.in : '')
            + (this.state.activeMessage + 1 == index
            || (this.state.activeMessage + 1 >= this.props.messages.length && index == 0)? styles.out : '');
          return (
            <div key={index} className={msgClass}>{err.description}</div>
          )
        });

      detailedErrors = orderedErrors.map((err, index) =>  (
        <div key={index} className={styles[classTranslation[err.level]]}><strong>{textTranslation[err.level]}:</strong> {err.description}</div>
      ));
    }

    return (
      <div className={styles.container + ' ' + this.getClass()}>
        <div className={styles.count + ' ' + (this.state.showDetailWindow? styles.active : '')} onClick={this.onClick}>{this.props.messages.length}</div>
        <div className={styles.messages} onClick={this.onClick}>
          {renderedErrors}
        </div>
        <div className={styles.detailWindow} style={(this.state.showDetailWindow ? {display: 'block'} : {})}>
          {detailedErrors}
        </div>
      </div>
    );
  }
}

ErrorsView.propTypes = {
  messages: React.PropTypes.array
};
