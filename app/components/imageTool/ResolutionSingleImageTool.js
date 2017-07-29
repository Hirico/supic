import React, { Component } from 'react';
import { Layout, Icon, Row, Col, Button } from 'antd';
import Dropzone from 'react-dropzone';
import SuperResolutionSlider from '../slider/SuperResolutionSlider';
import { tempSr } from '../../utils/pyCommunicator';
import styles from './ResolutionSingleImageTool.css';


const { Content, Footer } = Layout;

class ResolutionSingleImageTool extends Component {
  state = {
    fileUrl: '',
    imageWidth: 20,
    imageHeight: 20,
    slider: 1,
    out_width: 32,
    out_height: 16,
  };

  getSrPicture = () => {
    const printFunction = (message) => {
      this.props.getImgSrc(message);
      alert(`New picture save in ${message} temporarily. Click SAVE BUTTON to designated route if you like it.`);
    };

    tempSr(this.state.fileUrl, this.state.out_width, this.state.out_height, printFunction);
  };

  dropFile = (files) => {
    this.setState({
      fileUrl: files[0].path,
    });
    this.props.getImgSrc('Not designed');
    const img = new Image();
    img.src = files[0].path;
    // img.onload = function () {
    this.state.imageWidth = img.width;
    this.state.imageHeight = img.height;
    // alert('width:' + img.width + ',height:' + img.height);
    // };
    // console.log(‘Received files: ‘, files[0]);
    // console.log(this.state.fileUrl);
  };


  handleSlider = (val1, val2) => {
    this.setState({
      out_width: val1,
      out_height: val2,
    });
  }

  render() {
    return (
      <div>
        <Content>
          <Row type="flex" justify="start">
            <Col span={9} className={styles.middle_picture}>
              <Dropzone
                style={{ margin: 0, height: '100%', width: '100%' }}
                onDrop={this.dropFile.bind(this)}
                multiple={false}
                accept="image/*"
              >
                {this.state.fileUrl !== '' ? null :
                <div style={{ color: '#d9d9d9', fontSize: '15px' }}>Drop or click to upload.</div>}
                {this.state.fileUrl === '' ? null :
                <div className={styles.imageDropZone}>
                  <img
                    id="middle_img"
                    style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4) }}
                    src={this.state.fileUrl}
                    alt="没有图片"
                  />
                </div>}
              </Dropzone>
            </Col>
            <Col span={9} className={styles.middle_picture}>
              <img
                id="middle_img"
                style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4) }}
                src={this.state.fileUrl}
                alt="没有图片"
              />
            </Col>
          </Row>
        </Content>
        <Footer>
          <Row>
            <Col span={19} className={styles.footer}>
              <SuperResolutionSlider
                handleSlider={this.handleSlider.bind(this)}
                min={1}
                max={8}
                value={1}
                pre_width={this.state.imageWidth}
                pre_height={this.state.imageHeight}
              /><label
                htmlFor={`${styles.try}`}
                className={`${styles.note} ${styles.note_label_reso}`}
              >Resize
              Resolution</label>
              <Icon className={`${styles.zoom} ${styles.footer_icon}`} type="search" />
              <label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_zoom}`}>Magnifier</label>
              <Button
                onClick={this.getSrPicture}
                data-tclass="btn"
                shape="circle"
                className={`${styles.check_btn}`}
                icon="check"
              />
              /<label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_check}`}>check</label>
            </Col>
          </Row>
        </Footer>
      </div>

    );
  }
}

export default ResolutionSingleImageTool;
ResolutionSingleImageTool.propTypes = {
  resizeNum: React.PropTypes.number.isRequired,
  getImgSrc: React.PropTypes.func.isRequired,
};
