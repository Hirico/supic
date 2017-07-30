/**
 * Created by lu on 2017/7/25
 */
import React, { Component } from 'react';
import { Layout, Row, Col, InputNumber, Slider } from 'antd';
import Dropzone from 'react-dropzone';
import styles from './DepthNormalImageTool.css';

const { Content, Footer } = Layout;

class DepthNormalImageTool extends Component {
  state = {
    imageWidth: 20,
    imageHeight: 20,
    focalSliderValue: 1,
    blurSliderValue: 1,
  };

  dropFile = (files) => {
    this.props.getRawImgSrc(files[0].path);
    const img = new Image();
    img.src = files[0].path;
    this.state.imageWidth = img.width;
    this.state.imageHeight = img.height;
  };

  onChangeFocalSlider=(value) => {
    this.setState({
      focalSliderValue: value,
    });
  }

  onChangeBlurSlider=(value) => {
    this.setState({
      blurSliderValue: value,
    });
  }

  render() {
    return (
      <div>
        <Content>
          <Row type="flex" justify="start">
            <Col span={19} className={styles.middle_picture}>
              <Dropzone
                style={{ margin: 0, height: '100%', width: '100%' }}
                onDrop={this.dropFile.bind(this)}
                multiple={false}
                accept="image/*"
              >
                {this.props.rawImageSrc  === '' ? null :
                <div className={styles.imageDropZone}>
                  <p>{this.state.fileUrl}</p>
                  <img
                    id="middle_img"
                    style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4)}}
                    src={this.props.rawImageSrc }
                    alt="没有图片"
                  />
                </div>}
              </Dropzone>
            </Col>

          </Row>
        </Content>
        <Footer>
          <Row>
            <Col span={19} className={styles.footer}>
              <Slider
                min={1}
                max={255}
                step={1}
                onChange={this.onChangeFocalSlider}
                value={this.state.focalSliderValue}
                className={styles.focalSlider}
              />
              <InputNumber
                min={1}
                max={255}
                onChange={this.onChangeFocalSlider}
                value={this.state.focalSliderValue}
                className={styles.focalInputNumber}
              />
              <label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.focalLabel}`}>Blur Focal Distance</label>

              <Slider
                min={1}
                max={100}
                step={1}
                onChange={this.onChangeBlurSlider}
                value={this.state.blurSliderValue}
                className={styles.blurSlider}
              />
              <InputNumber
                min={1}
                max={100}
                onChange={this.onChangeBlurSlider}
                value={this.state.blurSliderValue}
                className={styles.blurInputNumber}
              />
              <label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.blurLabel}`}>Blade Curvature</label>
            </Col>
          </Row>
        </Footer>
      </div>

    );
  }
}
export default DepthNormalImageTool;
DepthNormalImageTool.propTypes = {
  resizeNum: React.PropTypes.number.isRequired,
  rawImageSrc: React.PropTypes.number.isRequired,
  getRawImgSrc: React.PropTypes.func.isRequired,
};
