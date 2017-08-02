/**
 * Created by lu on 2017/7/25
 */
import React, { Component } from 'react';
import { Layout, Row, Col, InputNumber, Slider, Icon, Button } from 'antd';
import Dropzone from 'react-dropzone';
import styles from './DepthNormalImageTool.css';
import { getDepth, lensBlur, saveResult } from '../../utils/pyCommunicator';

const { Content } = Layout;
const dialog = require('electron').remote.dialog;

const options = {
  title: 'Save an Image',
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif', 'ico', 'icns'] }
  ]
};

class DepthNormalImageTool extends Component {
  state = {
    fileUrl: '',       /* img src show in middle left area */
    rightURl: '',       /* depth src show in middle right area */
    imageWidth: 20,
    imageHeight: 20,
    minFocalDepth: 0,  /* [0,255] integer, the closest focal distance */
    maxFocalDepth: 0,  /* [0,255] integer, the farthest focal distance */
    transition: 0,     /* [0,255] integer, the transition part distance */
    radius: 0,         /* [0,50] integer, blur amount(boken radius) */
    brightness: 0,     /* [-1,1] float, boken brightness */
    speed: 1,          /* [1,10] int, the smaller, the slower and the more accurate */
    depthMapPath: '',  /* absolute depth map file path  */
    working: true,     /* slider and input field state, able or disabled */
    loading: false,    /* loading icon state, visible or not visible  */
    /* maximum value of transition, that is, minimum { minFocalDepth, 255-maxFocalDepth} */
    transMax: 0,
  };

  /**
   *  function load picture to left area
   */
  dropFile = (files) => {
    this.props.setRawImgSrc(files[0].path);
    console.log(files[0].path);
    /* get depth file callback */
    const printFunction = (res) => {
      this.setState({
        depthMapPath: res, /* refresh depth map file path */
        rightURl: res,
      });
      this.returnToDefault();
    };

    this.setState({
      fileUrl: files[0].path,  /* refresh img src in left area */
      loading: true,
      working: true,
    });

    this.props.setResultImgSrc('Not designed');  /* save function, pass parameter to parent component */
    const img = new Image();
    img.src = files[0].path;
    // add image
    this.props.addLeftItem(img.src);
    this.state.imageWidth = img.width;
    this.state.imageHeight = img.height;
    getDepth(files[0].path, printFunction);
  };

  /**
   *  function set sliders to default value
   */
  returnToDefault= () => {
    this.setState({
      minFocalDepth: 0,
      maxFocalDepth: 0,
      transition: 0,
      radius: 0,
      brightness: 0,
      speed: 1,
      working: false,
      loading: false,
    });
  }
  /**
   *  function load depth picture in right area
   */
  dropDepthFile=(files) => {
    const depthCallBack = (res) => {
      this.props.setResultImgSrc(res);
      this.setState({
        fileUrl: res,              /* refresh src in left middle area */
        working: false,            /* set slider to workable */
        loading: false,            /* set loading icon to not visible */
      });
    };
    this.setState({
      depthMapPath: files[0].path, /* refresh depth map file path */
      rightURl: files[0].path,
    });
    if (this.props.rawImageSrc === '') {
      this.setState({
        working: false,
        loading: false,
      });
    } else if (this.state.radius !== 0) {
      lensBlur(this.props.rawImageSrc, files[0].path, this.state.minFocalDepth,
          this.state.maxFocalDepth, this.state.transition, this.state.radius,
          this.state.brightness, this.state.speed, depthCallBack);
    }
  }
  /**
   *  function to change state after calling function lensBlur according to return value
   */
  changeState=(res, type) => {
    const printDepthFunction = (depthRes) => {
      this.setState({
        rightURl: depthRes,        /* refresh depth src in right middle area */
        working: false,            /* set slider to workable */
        loading: false,            /* set loading icon to not visible */
      });
    };
    console.log(`${type} change res: ${res}`);
    if (res !== undefined) {       /* success to generate a img file */
      this.setState({
        fileUrl: res,              /* refresh img src in middle left area */
      });
      this.props.setResultImgSrc(res);
      getDepth(res, printDepthFunction);
    }
  }

  /**
   *  function when moving slider which holds minFocalDepth and maxFocalDepth value
   */
  onChangeMinMaxFocalDepth=(value) => {
    const printMinFunction = (res) => {
      this.changeState(res, 'minMax');
    };
    this.setState({
      minFocalDepth: value[0],
      maxFocalDepth: value[1],
      transMax: (value[0] < (255 - value[1])) ? value[0] : (255 - value[1]),
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        loading: true,
      });
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, value[0], value[1],
        this.state.transition, this.state.radius, this.state.brightness,
        this.state.speed, printMinFunction);
    }
  }

  /**
   *  function when changing InputNumber component which holds minFocalDepth value
   */
  onChangeMinFocalDepth=(value) => {
    const printMinFunction = (res) => {
      this.changeState(res, 'min');
    };
    this.setState({
      minFocalDepth: value,
      transMax: (value < (255 - this.state.maxFocalDepth)) ?
        value : (255 - this.state.maxFocalDepth),
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        loading: true,
      });
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, value, this.state.maxFocalDepth,
        this.state.transition, this.state.radius, this.state.brightness,
        this.state.speed, printMinFunction);
    }
  }

  /**
   *  function when changing InputNumber component which holds maxFocalDepth value
   */
  onChangeMaxFocalDepth=(value) => {
    const printMaxFunction = (res) => {
      this.changeState(res, 'max');
    };
    this.setState({
      maxFocalDepth: value,
      transMax: (this.state.minFocalDepth < (255 - value)) ?
        this.state.minFocalDepth : (255 - value),
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        loading: true,
      });
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, this.state.minFocalDepth,
        value, this.state.transition, this.state.radius, this.state.brightness,
        this.state.speed, printMaxFunction);
    }
  }

  /**
   *  function when moving slider and InputNumber component which holds transition value
   */
  onChangeTransition=(value) => {
    const printTransitionFunction = (res) => {
      this.changeState(res, 'transition');
    };
    this.setState({
      transition: value,
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        loading: true,
      });
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, this.state.minFocalDepth,
        this.state.maxFocalDepth, value, this.state.radius, this.state.brightness,
        this.state.speed, printTransitionFunction);
    }
  }

  /**
   *  function when moving slider and InputNumber component which holds radius value
   */
  onChangeRadius=(value) => {
    const printRadiusFunction = (res) => {
      this.changeState(res, 'radius');
    };
    this.setState({
      radius: value,
      working: true,
      loading: true,
    });
    lensBlur(this.props.rawImageSrc, this.state.depthMapPath, this.state.minFocalDepth,
      this.state.maxFocalDepth, this.state.transition, value, this.state.brightness,
      this.state.speed, printRadiusFunction);
  }

  /**
   *  function when moving slider and InputNumber component which holds brightness value
   */
  onChangeBrightness=(value) => {
    const printBrightnessFunction = (res) => {
      this.changeState(res, 'brightness');
    };
    this.setState({
      brightness: value,
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        loading: true,
      });
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, this.state.minFocalDepth,
        this.state.maxFocalDepth, this.state.transition, this.state.radius, value,
        this.state.speed, printBrightnessFunction);
    }
  }

  /**
   *  function when moving slider and InputNumber component which holds speed value
   */
  onChangeSpeed=(value) => {
    this.setState({
      speed: value,
    });
  }

  /**
   * button clicked: upload left area picture
   */
  uploadLeftPic=() => {
    const self = this;
    const printFunction0 = (res) => {
      this.setState({
        depthMapPath: res, /* refresh depth map file path */
        rightURl: res,
        loading: false,
        working: false,
      });
    };
    self.returnToDefault();
    dialog.showOpenDialog({
      properties: ['openFile']
    }, (files) => {
      self.setState({
        fileUrl: files[0],  /* refresh img src in left area */
        loading: true,
        working: true,
      });
      self.props.setResultImgSrc('Not designed');  /* save function, pass parameter to parent component */
      const img = new Image();
      img.src = files[0];
      // add image
      self.props.addLeftItem(img.src);
      self.state.imageWidth = img.width;
      self.state.imageHeight = img.height;
      getDepth(self.state.fileUrl, printFunction0);
    });
  }

  /**
   * button clicked: upload right area picture
   */
  uploadRightPic= () => {
    const depthCallBack2 = (res) => {
      this.props.setResultImgSrc(res);
      this.setState({
        fileUrl: res,              /* refresh src in left middle area */
        working: false,            /* set slider to workable */
        loading: false,            /* set loading icon to not visible */
      });
    };
    const self = this;
    dialog.showOpenDialog({
      properties: ['openFile']
    }, (files) => {
      self.setState({
        depthMapPath: files[0],     /* refresh depth map file path */
        rightURl: files[0],
      });
      if (self.props.rawImageSrc === '') {
        self.setState({
          working: false,
          loading: false,
        });
      } else if (self.state.radius !== 0) {
        lensBlur(self.props.rawImageSrc, self.state.depthMapPath, self.state.minFocalDepth,
            self.state.maxFocalDepth, self.state.transition, self.state.radius,
            self.state.brightness, self.state.speed, depthCallBack2);
      }
    });
  }

  /**
   * button clicked: save left area result picture
   */
  saveLeftPic = () => {
    const printFunction = (res) => {
      alert(`Save in ${res}`);
    };
    if (this.state.fileUrl === '') {
      alert('No image source. Please load an image first.');
    } else {
      const self = this;
      dialog.showSaveDialog(options, (filename) => {
        if (self.state.fileUrl !== '') {
          saveResult(self.state.fileUrl, filename, printFunction);
        }
      });
    }
  }

  /**
   * button clicked: save right area result picture
   */
  saveRightPic = () => {
    const printFunction = (res) => {
      alert(`Save in ${res}`);
    };
    if (this.state.rightURl === '') {
      alert('No image source. Please load an image first.');
    } else {
      const self = this;
      dialog.showSaveDialog(options, (filename) => {
        if (self.state.rightURl !== '') {
          saveResult(self.state.rightURl, filename, printFunction);
        }
      });
    }
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <div style={{ height: 'calc(100vh - 64px)' }}>
        {/* middle img area */}
        <Content style={{ height: 'calc(100% - 118px)' }}>
          {/* import: import depth image */}
          <Row type="flex" justify="start">
            {/* left area */}
            <Col span={9} className={styles.middle_picture}>
              <Button ghost icon="upload" onClick={this.uploadLeftPic} style={{ left: '-5.6vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Import</Button>
              <Button ghost icon="download" onClick={this.saveLeftPic} style={{ left: '5.6vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Export</Button>
              <Dropzone
                style={{ margin: 0, height: 'calc(100vh - 300px)', width: '100%', border: '1px #fff dashed' }}
                onDrop={this.dropFile.bind(this)}
                multiple={false}
                accept="image/*"
              >
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
              <Icon type="plus" className={this.state.fileUrl === '' ? styles.plus : styles.hide} />

            </Col>
            {/* right area */}
            <Col span={9} className={styles.depth_picture_col}>
              <Button ghost icon="upload" onClick={this.uploadRightPic} style={{ left: '-5.6vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Import</Button>
              <Button ghost icon="download" onClick={this.saveRightPic} style={{ left: '5.6vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Export</Button>
              <Dropzone
                style={{ margin: 0, height: 'calc(100vh - 300px)', width: '100%', border: '1px #fff dashed' }}
                onDrop={this.dropDepthFile.bind(this)}
                multiple={false}
                accept="image/*"
              >
                {this.state.rightURl === '' ? null :
                <div className={styles.imageDropZone}>
                  <img
                    id="middle_img"
                    style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4) }}
                    src={this.state.rightURl}
                    alt="没有图片"
                  />
                </div>}
              </Dropzone>
              <Icon type="plus" className={this.state.rightURl === '' ? styles.plus : styles.hide} />
              <Icon type="loading" className={this.state.loading ? styles.loadingStart : styles.hide} spin={this.state.loading} />
            </Col>

          </Row>
        </Content>
        {/* tool area */}
        <Row className={styles.footer}>
          <Col span={1} />
          <Col span={10} >
            {/* range slider which holds minFocalDepth and maxFocalDepth value */}
            <Slider
              range
              value={[this.state.minFocalDepth, this.state.maxFocalDepth]}
              min={0}
              max={255}
              step={1}
              onChange={this.onChangeMinMaxFocalDepth}
              disabled={this.state.working}
              className={styles.minMaxSlider}
            />
            {/* InputNumber component with minFocalDepth value */}
            <InputNumber
              min={0}
              max={this.state.maxFocalDepth}
              onChange={this.onChangeMinFocalDepth}
              value={this.state.minFocalDepth}
              className={styles.minFocalDepthInput}
              disabled={this.state.working}
            />
            <label htmlFor={`${styles.try}`} className={styles.minFocalDepthLabel}>Min Focal Depth</label>
            {/* InputNumber component with maxFocalDepth value */}
            <InputNumber
              min={this.state.minFocalDepth}
              max={255}
              step={1}
              onChange={this.onChangeMaxFocalDepth}
              value={this.state.maxFocalDepth}
              className={styles.maxFocalDepthInput}
              disabled={this.state.working}
            />
            <label htmlFor={`${styles.try}`} className={styles.maxFocalDepthLabel}>Max Focal Depth</label>
            {/* slider with transition value */}
            <Slider
              min={0}
              max={this.state.transMax}
              step={1}
              onChange={this.onChangeTransition}
              value={this.state.transition}
              className={styles.transitionSlider}
              disabled={this.state.working}
            />
            {/* InputNumber component with transition value */}
            <InputNumber
              min={0}
              max={255}
              step={1}
              onChange={this.onChangeTransition}
              value={this.state.transition}
              className={styles.transitionInput}
              disabled={this.state.working}
            />
            <label htmlFor={`${styles.try}`} className={styles.transitionLabel}>Transition</label>
          </Col>
          <Col span={10}>
            {/* slider with radius value */}
            <Slider
              min={0}
              max={50}
              step={1}
              onChange={this.onChangeRadius}
              value={this.state.radius}
              className={styles.radiusSlider}
              disabled={this.state.working}
            />
            {/* InputNumber component with radius value */}
            <InputNumber
              min={0}
              max={50}
              step={1}
              onChange={this.onChangeRadius}
              value={this.state.radius}
              className={styles.radiusInput}
              disabled={this.state.working}
            />
            <label htmlFor={`${styles.try}`} className={styles.radiusLabel}>Radius</label>
            {/* slider with brightness value */}
            <Slider
              min={-1}
              max={1}
              step={0.1}
              onChange={this.onChangeBrightness}
              value={this.state.brightness}
              className={styles.brightnessSlider}
              disabled={this.state.working}
            />
            {/* InputNumber component with brightness value */}
            <InputNumber
              min={-1}
              max={1}
              step={0.1}
              onChange={this.onChangeBrightness}
              value={this.state.brightness}
              className={styles.brightnessInput}
              disabled={this.state.working}
            />
            <label htmlFor={`${styles.try}`} className={styles.brightnessLabel}>Brightness</label>

            {/* slider with speed value */}
            <Slider
              min={1}
              max={10}
              step={1}
              onChange={this.onChangeSpeed}
              value={this.state.speed}
              className={styles.speedSlider}
              disabled={this.state.working}
            />
            {/* InputNumber component with speed value */}
            <InputNumber
              min={1}
              max={10}
              step={1}
              onChange={this.onChangeSpeed}
              value={this.state.speed}
              className={styles.speedInput}
              disabled={this.state.working}
            />
            <label htmlFor={`${styles.try}`} className={styles.speedLabel}>Speed</label>
          </Col>
        </Row>
      </div>

    );
  }
}
export default DepthNormalImageTool;
DepthNormalImageTool.propTypes = {
  resizeNum: React.PropTypes.number.isRequired,
  rawImageSrc: React.PropTypes.string.isRequired,
  setRawImgSrc: React.PropTypes.func.isRequired,
  setResultImgSrc: React.PropTypes.func.isRequired,
  // {callback} add a small item in left menu when drop a file in drop zone
  addLeftItem: React.PropTypes.func.isRequired
};
