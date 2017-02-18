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

    if(this.props.getMax){
      this.start.max = this.props.getMax();
    }

    if(this.props.getMin){
      this.start.min = this.props.getMin();
    }

    this.createOverlay();
  }

  onMouseMove(e){
    const container = findDOMNode(this.refs.container);
    if(this.props.side == "top" || this.props.side == "bottom"){
      let newHeight = this.start.size.height + (this.start.mouse.y - e.clientY);

      if (this.start.min && newHeight < this.start.min)
         newHeight = this.start.min;

      if (this.start.max && newHeight > this.start.max)
        newHeight = this.start.max;

      container.style.height = newHeight + "px";
    }else{
      let newWidth = this.start.size.width + (this.start.mouse.x - e.clientX);

      if (this.start.min && newWidth < this.start.min)
        newWidth = this.start.min;

      if (this.start.max && newWidth > this.start.max)
        newWidth = this.start.max;

      container.style.width = newWidth + "px";
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
  getMin: React.PropTypes.func,
  getMax: React.PropTypes.func
};
