/**
 * Created by lu on 2017/7/20.
 */
import React, { Component } from 'react';
import { Slider, Icon, InputNumber } from 'antd';
import styles from './SRSlider.css';

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
    this.props.handleSlider(v * this.props.pre_width, v * this.props.pre_height);
  }
  handleWidthChange=(v) => {
    this.setState({
      cWidth: v,
      sliderValue: (v / this.props.pre_width),
      cHeight: ((v / this.props.pre_width) * this.props.pre_height),
    });
    this.props.handleSlider(v, ((v / this.props.pre_width) * this.props.pre_height));
  }
  handleHeightChange=(v) => {
    this.setState({
      cHeight: v,
      sliderValue: (v / this.props.pre_height),
      cWidth: ((v / this.props.pre_height) * this.props.pre_width),
    });
    this.props.handleSlider(((v / this.props.pre_height) * this.props.pre_width), v);
  }

  render() {
    return (
      <div className={styles.SR_icon_wrapper}>
        <Icon className={styles.anticon1} type="minus-circle" />
        <Slider
          {...this.props}
          className={styles.anticon}
          tipFormatter={formatter}
          value={this.state.sliderValue}
          onChange={this.handleChange}
          step={0.1}
        />
        <Icon className={styles.anticon2} type="plus-circle" />
        <InputNumber
          {...this.props}
          className={styles.inputWidth}
          min={this.props.pre_width}
          max={this.props.pre_height * 8}
          value={this.state.cWidth}
          onChange={this.handleWidthChange}
        />
        <InputNumber
          {...this.props}
          className={styles.inputHeight}
          min={this.props.pre_height}
          max={this.props.pre_height * 8}
          value={this.state.cHeight}
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
  value: React.PropTypes.number.isRequired
};
