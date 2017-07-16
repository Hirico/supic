// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Supic Demo</h2>
          <Link to="/counter">this is a Link</Link>
        </div>
      </div>
    );
  }
}
