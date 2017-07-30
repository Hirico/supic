/* eslint-disable no-extend-native */
/**
 * Created by wshwbluebird on 2017/7/29.
 */
import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
// import {Image} from 'antd';
import styles from './leftMenuItem.css';


class LeftMenuItem extends Component {

  constructor(props) {
    super(props);
    this.delData = this.delData.bind(this);
  }

  /**
   * delete function
   */
  delData() {
    this.props.delete(this.props.index);
  }

  /**
   * retuen
   * @returns {XML}
   */
  render() {
    return (
      <span>
        <img src={this.props.path} width={35} height={35} alt="？？？" />
        <Tooltip placement="top" title={'clean'}><Icon onClick={this.delData} className={styles.trigger} type="delete" /></Tooltip>
      </span>
    );
  }
}

export default LeftMenuItem;

LeftMenuItem.propTypes = {
  path: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
  delete: React.PropTypes.func.isRequired
};

