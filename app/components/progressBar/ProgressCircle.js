/**
 * Created by wshwbluebird on 2017/8/2.
 */
import React, { Component } from 'react';
import { Tooltip, Progress } from 'antd';
import styles from './ProcessCircle.css';


class ProgressCircle extends Component {
  render() {
    let percent = 0;
    let message = '';
    let formatShow = '';
    let sta = '';
    const style = styles.circle;

    if (this.props.state === 'fail') {
      percent = 100;
      message = this.props.message;
      formatShow = 'Fail';
      sta = 'exception';
    } else if (this.props.state === 'done') {
      percent = 100;
      message = this.props.message;
      formatShow = 'Done';
      sta = 'success';
    } else if (this.props.state === 'dealing') {
      percent = 50;
      message = 'dealing';
      formatShow = 'Deal';
      sta = 'active';
    } else if (this.props.state === 'waiting') {
      percent = 0;
      message = 'waiting';
      formatShow = 'Wait';
      sta = 'active';
    } else {
      return (
        <div />
      );
    }

    return (
      <Tooltip placement="top" title={message}>
        <Progress
          type="circle"
          className={style}
          width={40}
          percent={percent}
          status={sta}
          format={() => formatShow}
          spin
        />
      </Tooltip>
    );
  }
}

export default ProgressCircle;

ProgressCircle.propTypes = {
  message: React.PropTypes.string.isRequired,
  state: React.PropTypes.string.isRequired,

};

