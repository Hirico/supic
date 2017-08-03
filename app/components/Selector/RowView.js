/**
 * Created by wshwbluebird on 2017/8/1.
 */
/**
 * Created by wshwbluebird on 2017/8/1.
 */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Select } from 'antd';
import SuperResolutionSlider from '../slider/MultipleSelectionSlider';
import styles from './RowView.css';
import ProcessCircle from '../progressBar/ProgressCircle';
import picType from '../../utils/PicType';

const TypeName = Object.keys(picType);
const Option = Select.Option;

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
   * change the picture type when select
   * @param value selected value
   */
  handleChange = (value) => {
    this.props.type_change(value, this.props.item_index);
  }

  /**
   * retuen html parse
   * @returns {XML}
   */
  render() {
    return (

      <Row align={'middle'} type={'flex'}>
        <Col span={2} offset={1}>
          <img className={styles.pic} src={this.props.image_url} alt="NJU" />
        </Col>
        <Col span={12} >
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
        <Col span={2} offset={0}>
          <Select
            defaultValue={TypeName[0]}
            className={styles.selector}
            onChange={this.handleChange.bind(this)}
          >
            {
              TypeName.map(key => (
                <Option value={picType[key]}>{key}</Option>
              ))
            }
          </Select>
        </Col>
        <Col span={2} offset={1}>
          <Tooltip placement="top" title={'clean'}>
            <Icon onClick={this.deletePicture.bind(this)} className={styles.trigger} type="delete" />
          </Tooltip>
        </Col>
        <Col span={2} offset={1}>
          <ProcessCircle message={this.props.message} state={this.props.status} />
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
  // index of the row
  item_index: React.PropTypes.number.isRequired,
  // callback when select a type
  type_change: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired
};

