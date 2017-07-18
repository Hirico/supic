// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Gallery.css';

class Gallery extends Component {

  decrement = () => {
    console.log(123);
  };

  dropFile = (e) => {
    e.preventDefault();
    console.log(123);
    client.invoke('calc', '1 + 1', (error, res) => {
      if (error) {
        console.error(error);
      } else {
        const result = document.querySelector('#py-result');
        result.textContent = res;
      }
    });
    for (let f of e.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f.path);
    }
    return false;
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

const zerorpc = require('zerorpc');

const client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

