/**
 * Created by wshwbluebird on 2017/8/1.
 */
import React, { Component } from 'react';
import { Col, Layout, Row, Upload, Button, Icon, Progress, Select } from 'antd';
import Dropzone from 'react-dropzone';
import styles from './MultipleSelector.css';
import RowView from './RowView';
import SingleSlider from '../slider/SingleSlider';
import batchSr from '../../utils/pyCommunicator';
import picType from '../../utils/PicType';
// eslint-disable-next-line import/no-unresolved


const fs = require('fs');

const filename = './multiples.txt';

const TypeName = Object.keys(picType);
const Option = Select.Option;

const assert = require('assert');

const dialog = require('electron').remote.dialog;

const { Content, Footer } = Layout;


class MultipleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image_urls: [],
      raw_heights: [],
      raw_widths: [],
      new_heights: [],
      new_widths: [],
      pictureType: [],
      dealState: [],
      backInfo: [],
      sliderValues: [],
      percent: 0,
      finish_number: 0, // complete number
      processing: false, // is python runtime on?
      exporting: false,   // is export dialog open
      // slider_value: 1    // common sliderValue

    };
  }
  /**
   * load state before mount
   */
  componentWillMount() {
    fs.exists(filename, () => {
      const log = fs.readFileSync(filename);
      const sta = JSON.parse(log);
      this.setState(sta);
    });
  }
  /**
   * save state before out
   */
  componentWillUnmount() {
    if (this.state.processing) {
      return;
    }
    const log = JSON.stringify(this.state);
    fs.writeFileSync(filename, log);
  }
  /**
   * calback function
   * @param v   scale by slider
   * @param index
   */

  handleSlider = (v, index) => {
    if (this.state.processing) return;
    this.state.sliderValues[index] = v;
    this.state.new_heights[index] = v * this.state.raw_heights[index];
    this.state.new_widths[index] = v * this.state.raw_widths[index];
    this.setState({
      sliderValues: this.state.sliderValues,
      new_heights: this.state.new_heights,
      new_widths: this.state.new_widths
    });
  }
  /**
   * handle width change
   * @param v    new width
   * @param index
   */
  handleWidthChange=(v, index) => {
    if (this.state.processing) return;
    this.state.new_widths[index] = v;
    this.state.sliderValues[index] = v / this.state.raw_widths[index];
    this.state.new_heights[index] = this.state.sliderValues[index] * this.state.raw_heights[index];
    this.setState({
      sliderValues: this.state.sliderValues,
      new_heights: this.state.new_heights,
      new_widths: this.state.new_widths
    });
  }
  /**
   * handle height change
   * @param v    new height
   * @param index
   */
  handleHeightChange=(v, index) => {
    if (this.state.processing) return;
    this.state.new_heights[index] = v;
    this.state.sliderValues[index] = v / this.state.raw_heights[index];
    this.state.new_widths[index] = this.state.sliderValues[index] * this.state.raw_widths[index];
    this.setState({
      sliderValues: this.state.sliderValues,
      new_heights: this.state.new_heights,
      new_widths: this.state.new_widths
    });
  }

  /**
   * delete an item in selectors {callbck}
   * @param index
   */
  // TODO reuse
  deleteItem = (index) => {
    if (this.state.processing) return;
    let finishNumber = this.state.finish_number;
    finishNumber -= 1;
    this.setState({ image_urls: this.deleteOne(this.state.image_urls, index),
      raw_heights: this.deleteOne(this.state.raw_heights, index),
      raw_widths: this.deleteOne(this.state.raw_widths, index),
      new_heights: this.deleteOne(this.state.new_heights, index),
      new_widths: this.deleteOne(this.state.new_widths, index),
      pictureType: this.deleteOne(this.state.pictureType, index),
      dealState: this.deleteOne(this.state.dealState, index),
      backInfo: this.deleteOne(this.state.backInfo, index),
      sliderValues: this.deleteOne(this.state.sliderValues, index),
      finish_number: finishNumber
    });
  }

  /**
   * util to delete one item in specific list
   * @param rawList
   * @param index
   */
  deleteOne = (rawList, index) => {
    // delete the index element in the array
    rawList.splice(index, 1);
    return rawList;
  }

  /**
   * when user drop files into dropZone
   * @param files
   */
  dropFile = (files) => {
    // check is running
    if (this.state.processing) return;
    // udpdate file list
    this.clearAll();
    files.forEach(f => {
      this.addOne(f);
    });
  }

  /**
   * clear all 'done' image when drag a file in zone
   */
  clearAll = () => {
    for (let i = 0; i < this.state.image_urls.length; i += 1) {
      if (this.state.dealState[i] === 'done') {
        this.deleteItem(i);
        i -= 1;
      }
    }
    this.setState({
      percent: 0,
      finish_number: 0
    });
  }

  /**
   * add one file to the imageList
   * @param file
   */
  addOne = (file) => {
    const list1 = this.state.image_urls;
    const list2 = this.state.raw_widths;
    const list3 = this.state.raw_heights;
    const list4 = this.state.new_widths;
    const list5 = this.state.new_heights;
    const list6 = this.state.pictureType;
    const list7 = this.state.dealState;
    const list8 = this.state.backInfo;
    const list9 = this.state.sliderValues;

    const img = new Image();
    img.src = file.path;
    img.onload = () => {
      list1.push(img.src);
      list2.push(img.width);
      list3.push(img.height);
      list4.push(img.width);
      list5.push(img.height);
      list6.push(0);
      list7.push('no');
      list8.push('no');
      list9.push(1);
      this.setState({
        image_urls: list1,
        raw_heights: list3,
        raw_widths: list2,
        new_heights: list5,
        new_widths: list4,
        pictureType: list6,
        dealState: list7,
        backInfo: list8,
        sliderValues: list9
      });
      this.setState({
        image_urls: list1,
        raw_heights: list3,
        raw_widths: list2,
        new_heights: list5,
        new_widths: list4,
        pictureType: list6,
        dealState: list7,
        backInfo: list8,
        sliderValues: list9
      });
    };
  }
  /**
   * make a fake uploader
   * real load on the top list
   */
// eslint-disable-next-line no-unused-vars
  beforeUpload = (file, fileList) => {
    fileList = [];
    this.dropFile([file]);
    return false;
  }

  /**
   * select dir when click the choose button
   */
  exportAll = () => {
    // check is running
    if (this.state.exporting) return;
    if (this.state.processing) return;
    this.state.exporting = true;
    const chooseOption = {
      title: 'choose save path',
      properties: [
        'openDirectory'
      ]
    };


    // select dir dialog
    dialog.showOpenDialog(chooseOption, (dir) => {
      // reset the exporting
      this.state.exporting = false;
      // return if user click cancel
      assert(dir.length > 0);
      // transform the new height and width to interger
      const widths = this.state.new_widths.map(t => Math.round(t));
      const heights = this.state.new_heights.map(t => Math.round(t));
      // eslint-disable-next-line no-unused-vars
      const list = this.state.dealState.map(t => 'waiting');
      list[0] = 'dealing';
      this.setState({
        dealState: list,
        processing: true
      });
      const imageUrls = this.state.image_urls.map(t => t.slice(7));
      // alert(imageUrls)
      // call python interface
      // alert(widths);
      // alert(heights);
      batchSr(imageUrls, dir[0], widths, heights, this.state.pictureType,
        (doc, err, finishNumber, totalNumber) => {
          // get state and backlog from callabck
          const listState = this.state.dealState;
          const listMessage = this.state.backInfo;
          // update next next dealing mage
          if (finishNumber !== totalNumber) { listState[finishNumber] = 'dealing'; } else {
            this.setState({
              processing: false
            });
          }
          // update next finish image
          if (doc === null) {
            listState[finishNumber - 1] = 'fail';
            listMessage[finishNumber - 1] = err;
          } else {
            listState[finishNumber - 1] = 'done';
            listMessage[finishNumber - 1] = doc;
          }
          // update progressbar
          this.setState({
            percent: ((finishNumber * 100) / totalNumber),
            finish_number: finishNumber,
            dealState: listState,
            backInfo: listMessage
          });
          if (finishNumber === totalNumber) {
            this.state.processing = false;
            this.state.finish_number = finishNumber;
            this.state.percent = ((finishNumber * 100) / totalNumber);
            const log = JSON.stringify(this.state);
            fs.writeFileSync(filename, log);
          }
        });
    });
  }
  /**
   * change the picture type of specific index
   * @param value  select value
   * @param index  index of the list
   */
  selectChange = (value, index) => {
    if (this.state.processing) return;
    this.state.pictureType[index] = value;
  }

  /**
   * function when the user drag the common slider
   * @param value
   */
  commonSlider = (value) => {
    // TODO check speed
    for (let i = 0; i < this.state.sliderValues.length; i += 1) { this.handleSlider(value, i); }
  }
  /**
   * unction when the user select the common chooser
   * @param value
   */
  commonChange = (value) => {
    const list = this.state.pictureType.map(() => value);
    this.setState({
      pictureType: list
    });
  }

  render() {
    // some property of file uploader
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      defaultFileList: [],
      showUploadList: false,
      multiple: true,
      beforeUpload: this.beforeUpload,
      disabled: this.state.processing

    };
    // noinspection JSAnnotator
    return (
      <div style={{ margin: 0, width: '100%' }}>
        <Content style={{ margin: 0, height: '100%', width: 'calc(100% - 180px)' }}>
          <Row style={{ margin: 0, width: '100%' }}>
            <Col span={19} className={styles.middle_select} style={{ margin: 0, width: '100%' }}>
              <Dropzone
                style={{ margin: 0, height: '100%', width: '100%' }}
                onDrop={this.dropFile.bind(this)}
                multiple
                accept="image/*"
                disableClick
              >
                {
                  this.state.image_urls.length === 0 ?
                    <div className={styles.dropWord} >Drop or click button to upload</div> :
                  // lambda to get all element in list
                  this.state.image_urls.map((url, i) => (
                    <div style={{ width: '100%', height: '15vh' }}>
                      <RowView
                        raw_width={this.state.raw_widths[i]}
                        raw_height={this.state.raw_heights[i]}
                        image_url={url}
                        handleSlider={this.handleSlider}
                        handleWidth={this.handleWidthChange}
                        handleHeight={this.handleHeightChange}
                        slider_value={this.state.sliderValues[i]}
                        deleteItem={this.deleteItem}
                        type_change={this.selectChange}
                        item_index={i}
                        status={this.state.dealState[i]}
                        message={this.state.backInfo[i]}
                        picType={this.state.pictureType[i]}
                      />
                    </div>
                  ))
                }
              </Dropzone>
            </Col>
          </Row>
        </Content>
        <Footer>
          <Row>
            <Col span={3}>
              <div>
                <Upload {...props} >
                  <Button>
                    <Icon type="upload" /> upload
                    </Button>
                </Upload>
              </div>
            </Col>
            <Col span={3} >
              <div>
                <Button onClick={this.exportAll.bind(this)}>
                  <Icon type="save" /> export
                </Button>
              </div>
            </Col>
            <Col span={1} offset={2}>
              <label className={`${styles.note_label} ${styles.px1_label}`} htmlFor={`${styles.try}`} >ALL</label>
            </Col>
            <Col span={5}>
              <SingleSlider
                handleSlider={this.commonSlider.bind(this)}
                min={1}
                max={2}
              />
            </Col>
            <Col span={2}>
              <Select
                defaultValue={TypeName[0]}
                className={styles.selector}
                onChange={this.commonChange.bind(this)}
              >
                {
                  TypeName.map(key => (
                    <Option value={picType[key]}>{key}</Option>
                  ))
                }
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <div>
                <Progress
                  className={styles.Process_bar}
                  percent={this.state.percent}
                  format={() => `${this.state.finish_number}/${this.state.image_urls.length}`}
                />
              </div>
            </Col>
          </Row>
        </Footer>
      </div>

    );
  }
}

export default MultipleSelector;
