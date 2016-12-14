// @flow
import React, {Component} from 'react';

import levels, {classTranslation, textTranslation} from 'graph/ErrorLevel';
import styles from './CodeView.scss';

export default class CodeView extends Component {

  renderErrors(){
    if(!this.props.errors || !this.props.errors.length) return;

    const orderedErrors = this.props.errors.sort((a, b) => b.importance - a.importance);
    const detailedErrors = orderedErrors.map((err, index) =>  (
      <div key={index} className={styles[classTranslation[err.level]]}><strong>{textTranslation[err.level]}:</strong> {err.description}</div>
    ));

    return (<div className={styles.errorsOverlay}>
      <h3>Errors found!</h3>
      {detailedErrors}
      </div>)
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderErrors()}
        <div className={styles.code} data-selectable>
          {this.props.code}
        </div>
      </div>
    );
  }
}

CodeView.propTypes = {
  code: React.PropTypes.string,
  errors: React.PropTypes.array,
  onHighlight: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.string
};
