/**
 * Created by wshwbluebird on 2017/8/3.
 */
import React, { Component } from 'react';
import { Slider, Icon, Row, Col } from 'antd';
import styles from './SingleSlider.css';

class SingleSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    };
  }

  /**
   * deal when slider is changed
   * @param v
   */
  handleChange = (v) => {
    this.setState({
      value: v
    });
    this.props.handleSlider(v);
  }

  render() {
    return (
      <div className={styles.SR_icon_wrapper}>
        <Row type={'flex'} align={'bottom'}>
          <Col span={1} >
            <Icon className={styles.anticon1} type="minus-circle" />
          </Col>
          <Col span={10}>
            <Slider
              {...this.props}
              className={styles.anticon}
              tipFormatter={formatter}
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              step={0.1}
            />
          </Col>
          <Col span={1}>
            <Icon className={styles.anticon2} type="plus-circle" />
          </Col>
        </Row>
      </div>
    );
  }
}
function formatter(value) {
  return `x${value}`;
}

export default SingleSlider;

SingleSlider.propTypes = {
  handleSlider: React.PropTypes.func.isRequired
};
