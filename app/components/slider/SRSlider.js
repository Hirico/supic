/**
 * Created by lu on 2017/7/20.
 */
import React, { Component } from 'react';
import { Slider, Icon } from 'antd';
import styles from './SRSlider.css';

class SRSlider extends Component {
  constructor(props) {
    super(props);
    const { max, min } = props;
    const mid = ((max - min) / 2).toFixed(5);
    this.state = {
      nextIconClass: this.props.value >= mid ? '' : 'styles.anticon_highlight',
      preIconClass: this.props.value >= mid ? 'styles.anticon_highlight' : '',
      mid,
      sliderValue: this.props.value,
    };
  }
  handleChange = (v) => {
    this.setState({
      nextIconClass: v >= this.state.mid ? '' : 'styles.anticon_highlight',
      preIconClass: v >= this.state.mid ? 'styles.anticon_highlight' : '',
      sliderValue: v,
    });
  }
  render() {
    return (
      <div className={styles.SR_icon_wrapper}>
        <Icon className={styles.anticon1} type="minus-circle" />
        <Slider
          {...this.props}
          className={styles.anticon}
          tipFormatter={formatter}
          onChange={this.handleChange}
          value={this.state.sliderValue}
        />
        <Icon className={styles.anticon2} type="plus-circle" />
      </div>
    );
  }
}
function formatter(value) {
  return `x${value}`;
}

export default SRSlider;
SRSlider.propTypes = {
  max: React.PropTypes.number.isRequired,
  min: React.PropTypes.number.isRequired,
  value: React.PropTypes.number.isRequired
};
