// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Gallery.css';

class Gallery extends Component {
  props: {
    decrement: () => void
  };

  dropFile = (e) => {
    e.preventDefault();
    for (let f of e.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f.path);
    }
    return false;
  };

  render() {
    const { decrement } = this.props;
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
          <button className={styles.btn} onClick={decrement} data-tclass="btn">
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

const drop = document.querySelector('#drop-file');
const result = document.querySelector('#py-result');
drop.addEventListener('drop', () => {
  client.invoke('calc', '1 + 1', (error, res) => {
    if (error) {
      console.error(error);
    } else {
      result.textContent = res;
    }
  });
});
drop.dispatchEvent(new Event('drop'));
