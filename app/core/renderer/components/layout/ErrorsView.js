// @flow
import React, {Component} from 'react';

import levels, {classTranslation, textTranslation} from 'graph/ErrorLevel';
import styles from './ErrorsView.scss';

const MESSAGES_CYCLE = 4000;

export default class ErrorsView extends Component {

  constructor(props){
    super(props);

    this.state = {
      activeMessage: 0
    };

    this.interval = null;
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

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  getCountClass() {
    if (this.props.messages.find(msg => msg.level == levels.ERROR) != null)
      return styles.errorCount;

    if (this.props.messages.find(msg => msg.level == levels.WARNING) != null)
      return styles.warningCount;

    if (this.props.messages.find(msg => msg.level == levels.INFO) != null)
      return styles.infoCount;

    return styles.okCount;
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
      <div className={styles.container}>
        <div className={this.getCountClass()}>{this.props.messages.length}</div>
        <div className={styles.messages}>
          {renderedErrors}
        </div>
        <div className={styles.detailWindow}>
          {detailedErrors}
        </div>
      </div>
    );
  }
}

ErrorsView.propTypes = {
  messages: React.PropTypes.array
};
