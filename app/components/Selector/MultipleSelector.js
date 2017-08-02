/**
 * Created by wshwbluebird on 2017/8/1.
 */
import React, { Component } from 'react';
import { Col, Layout, Row, Upload, Button, Icon, Progress } from 'antd';
import Dropzone from 'react-dropzone';
import styles from './MultipleSelector.css';
import RowView from './RowView';

const dialog = require('electron').remote.dialog;

const { Content, Footer } = Layout;

class MultipleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image_urls: ['/Users/wshwbluebird/Desktop/test.png', '/Users/wshwbluebird/Desktop/test.png',
        '/Users/wshwbluebird/Desktop/test.png'],
      raw_heights: [50, 50, 50],
      raw_widths: [50, 50, 50],
      new_heights: [50, 50, 50],
      new_widths: [50, 50, 50],
      out_dir: '',  // store all output images
      percent: 0,
      finish_number: 0 // complete number

    };
  }

  /**
   * calback function
   * @param valWidth   scale by slider
   * @param valHeight  scale by slider
   * @param index
   */
  handleSlider = (valWidth, valHeight, index) => {
    this.state.new_heights[index] = valHeight;
    this.state.new_widths[index] = valWidth;
  }

  /**
   * delete an item in selectors {callbck}
   * @param index
   */
  // TODO reuse
  deleteItem = (index) => {
    this.setState({ image_urls: this.deleteOne(this.state.image_urls, index),
      raw_heights: this.deleteOne(this.state.raw_heights, index),
      raw_widths: this.deleteOne(this.state.raw_widths, index),
      new_heights: this.deleteOne(this.state.new_heights, index),
      new_widths: this.deleteOne(this.state.new_widths, index) });
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
    // udpdate file list
    files.forEach(f => {
      this.addOne(f);
    });
  }

  addOne = (file) => {
    const list1 = this.state.image_urls;
    const list2 = this.state.raw_widths;
    const list3 = this.state.raw_heights;
    const list4 = this.state.new_widths;
    const list5 = this.state.new_heights;

    const img = new Image();
    img.src = file.path;
    list1.push(img.src);
    list2.push(img.width);
    list3.push(img.height);
    list4.push(img.width);
    list5.push(img.height);


    this.setState({
      image_urls: list1,
      raw_heights: list3,
      raw_widths: list2,
      new_heights: list5,
      new_widths: list4
    });
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
  chooseDir= () => {
    const chooseOption = {
      title: 'choose save path',
      properties: [
        'openDirectory'
      ]
    };

    dialog.showOpenDialog(chooseOption, (files) => {
      this.setState({
        out_dir: files
      });
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
      beforeUpload: this.beforeUpload
    };
    return (
      <div>
        <Content >
          <Row type="flex" justify="start">
            <Col span={19} className={styles.middle_select}>
              <Dropzone
                style={{ margin: 0, height: '100%', width: '100%' }}
                onDrop={this.dropFile.bind(this)}
                multiple
                accept="image/*"
                disableClick
              >
                {
                  // lambda to get all element in list
                  this.state.image_urls.map((url, i) => (
                    <div>
                      <RowView
                        raw_width={this.state.raw_widths[i]}
                        raw_height={this.state.raw_heights[i]}
                        image_url={url}
                        handleSlider={this.handleSlider}
                        deleteItem={this.deleteItem}
                        item_index={i}
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
            <Col span={3} offset={1}>
              <div>
                <Button onClick={this.chooseDir.bind(this)}>
                  <Icon type="save" /> export
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <div>
                <Progress
                  className={styles.Process_bar}
                  percent={this.state.percent}
                  format={() => this.state.finish_number}
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
