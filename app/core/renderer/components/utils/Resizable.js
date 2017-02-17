// @flow
import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';

import styles from './Resizable.scss';

export default class Resizable extends Component {

  constructor(props){
    super(props);

    this.start = null;
    this.overlay = null;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseUp(){
    document.body.removeChild(this.overlay);
    this.start = null;
    this.overlay = null;

    // TODO: [Medium] After finishing resizing the window store it to user's settings
  }

  createOverlay(){
    this.overlay = document.createElement("div");
    this.overlay.className = ( this.props.side == "top" || this.props.side == "bottom" ? styles.overlayVertical : styles.overlayHorizontal );
    this.overlay.addEventListener('mousemove', this.onMouseMove);
    this.overlay.addEventListener('mouseup', this.onMouseUp);

    document.body.appendChild(this.overlay);

  }

  onMouseDown(e){
    const container = findDOMNode(this.refs.container);

    this.start = {
        mouse: {
          x: e.clientX,
          y: e.clientY
        },
        size: {
          width: container.offsetWidth,
          height: container.offsetHeight
        }
      };

    this.createOverlay();
  }

  onMouseMove(e){
    if(!this.start) return;

    const container = findDOMNode(this.refs.container);
    if(this.props.side == "top" || this.props.side == "bottom"){
        container.style.height = this.start.size.height + (this.start.mouse.y - e.clientY) + "px";
    }else{
      container.style.width = this.start.size.width + (this.start.mouse.x - e.clientX) + "px";
    }
  }


  render() {
    let containerClass;
    switch (this.props.side) {
      case "left":
        containerClass = styles.leftContainer;
        break;
      case "right":
        containerClass = styles.rightContainer;
        break;
      case "top":
        containerClass = styles.topContainer;
        break;
      case "bottom":
        containerClass = styles.bottomContainer;
        break;
    }

    return (
      <div className={containerClass + " " + this.props.class} ref="container">
        <div className={styles.bar} onMouseDown={this.onMouseDown}></div>
        <div className={styles.contentWrapper}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Resizable.propTypes = {
  class: React.PropTypes.string.isRequired,
  side: React.PropTypes.string.isRequired,
};
