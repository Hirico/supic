/**
 * Created by wshwbluebird on 2017/8/1.
 */

/**
 * copy from lyq 因为我不会复用css
 */
import React, { Component } from 'react';
import { Slider, Icon, InputNumber, Row, Col } from 'antd';
import styles from './MultipleSelectionSlider.css';

class SRSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cHeight: this.props.pre_height,
      sliderValue: this.props.value,
      cWidth: this.props.pre_width,
    };
  }
  handleChange = (v) => {
    this.setState({
      cWidth: v * this.props.pre_width,
      sliderValue: v,
      cHeight: v * this.props.pre_height,
    });
    this.props.handleSlider(v, this.props.slider_index);
  }
  handleWidthChange=(v) => {
    this.setState({
      cWidth: v,
      sliderValue: (v / this.props.pre_width),
      cHeight: ((v / this.props.pre_width) * this.props.pre_height),
    });
    this.props.handleWidth(v, this.props.slider_index);
  }
  handleHeightChange=(v) => {
    this.setState({
      cHeight: v,
      sliderValue: (v / this.props.pre_height),
      cWidth: ((v / this.props.pre_height) * this.props.pre_width),
    });
    this.props.handleHeight(v, this.props.slider_index);
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
              value={this.props.value}
              onChange={this.handleChange}
              step={0.1}
            />
          </Col>
          <Col span={1}>
            <Icon className={styles.anticon2} type="plus-circle" />
          </Col>
        </Row>
        <InputNumber
          {...this.props}
          className={styles.inputWidth}
          min={this.props.pre_width}
          max={this.props.pre_width * 2}
          value={this.props.pre_width * this.props.value}
          onChange={this.handleWidthChange}
        />
        <InputNumber
          {...this.props}
          className={styles.inputHeight}
          min={this.props.pre_height}
          max={this.props.pre_height * 2}
          value={this.props.pre_height * this.props.value}
          onChange={this.handleHeightChange}
        />
        <label className={`${styles.note_label} ${styles.px1_label}`} htmlFor={`${styles.try}`} >px</label>
        <label className={`${styles.note_label} ${styles.width_label}`} htmlFor={`${styles.try}`} >width</label>
        <label className={`${styles.note_label} ${styles.height_label}`} htmlFor={`${styles.try}`} >height</label>
        <label className={`${styles.note_label} ${styles.px2_label}`} htmlFor={`${styles.try}`} >px</label>
      </div>
    );
  }
}
function formatter(value) {
  return `x${value}`;
}

export default SRSlider;
SRSlider.propTypes = {
  pre_width: React.PropTypes.number.isRequired,
  pre_height: React.PropTypes.number.isRequired,
  value: React.PropTypes.number.isRequired,
  slider_index: React.PropTypes.number.isRequired,
  handleSlider: React.PropTypes.func.isRequired,
  handleWidth: React.PropTypes.func.isRequired,
  handleHeight: React.PropTypes.func.isRequired
};

