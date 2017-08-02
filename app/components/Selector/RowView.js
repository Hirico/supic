/**
 * Created by wshwbluebird on 2017/8/1.
 */
/**
 * Created by wshwbluebird on 2017/8/1.
 */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import SuperResolutionSlider from '../slider/MultipleSelectionSlider';
import styles from './RowView.css';

class RowView extends Component {

  /**
   * callback handle slider function with index
   * @param val1
   * @param val2
   */
  handleSlider = (val1, val2) => {
    this.props.handleSlider(val1, val2, this.props.item_index);
  }

  /**
   * delete this view when user click it
   */
  deletePicture = () => {
    this.props.deleteItem(this.props.item_index);
  }

  /**
   * retuen html parse
   * @returns {XML}
   */
  render() {
    return (

      <Row align={'middle'} type={'flex'}>
        <Col span={2} offset={2}>
          <img className={styles.pic} src={this.props.image_url} alt="NJU" />
        </Col>
        <Col span={7} >
          <SuperResolutionSlider
            handleSlider={this.handleSlider.bind(this)}
            min={1}
            max={2}
            step={0.1}
            value={1}
            pre_width={this.props.raw_width}
            pre_height={this.props.raw_height}
          />
        </Col>
        <Col span={2} offset={5}>
          <Tooltip placement="top" title={'clean'}>
            <Icon onClick={this.deletePicture.bind(this)} className={styles.trigger} type="delete" />
          </Tooltip>
        </Col>
      </Row>
    );
  }
}
export default RowView;

RowView.propTypes = {
  raw_width: React.PropTypes.number.isRequired,
  raw_height: React.PropTypes.number.isRequired,
  image_url: React.PropTypes.string.isRequired,
  handleSlider: React.PropTypes.func.isRequired,
  deleteItem: React.PropTypes.func.isRequired,
  item_index: React.PropTypes.number.isRequired
};

