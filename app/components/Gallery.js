// @flow
import { resolve } from 'path';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Gallery.css';
import { tempSr } from '../utils/pyCommunicator';

class Gallery extends Component {

  // sr api(tempSr) sample, click the second circle, wait a while and
  // the console should print the output file path
  decrement = () => {
    const printFunction = (message) => {
      console.log(message);
    };

    tempSr(resolve('./resources/icon.png'), 512, 512, printFunction);
  };

  dropFile = (e) => {
    e.preventDefault();
    console.log(123);
  };

  render() {
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={styles.counter} data-tid="counter">
          <div id="drop-file" onDrop={this.dropFile}>
            <p>Drag your file here</p>
            <div id="py-result" />
          </div>
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} data-tclass="btn">
            <i className="fa fa-plus" />
          </button>
          <button className={styles.btn} onClick={this.decrement} data-tclass="btn">
            <i className="fa fa-minus" />
          </button>
        </div>
      </div>
    );
  }
}

export default Gallery;

