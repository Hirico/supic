/**
 * Created by lu on 2017/7/25
 */
import React, { Component } from 'react';
import { Layout, Row, Col, InputNumber, Slider, Icon, Button } from 'antd';
import Dropzone from 'react-dropzone';
import styles from './DepthNormalImageTool.css';
import { getDepth, lensBlur, saveResult } from '../../utils/pyCommunicator';

const { Content } = Layout;

const electron = require('electron');

const dialog = electron.remote.dialog;

const prePath = `${electron.remote.app.getPath('userData')}/pic_temp`;

const options = {
  title: 'Save an Image',
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif', 'ico', 'icns'] }
  ]
};


const fs = require('fs');

const depthFilename = `${prePath}/depth.txt`;

class DepthNormalImageTool extends Component {
  state = {
    fileUrl: '',       /* img src show in middle left area */
    imageWidth: 20,
    imageHeight: 20,
    minFocalDepth: 0,  /* [0,255] integer, the closest focal distance */
    maxFocalDepth: 255,  /* [0,255] integer, the farthest focal distance */
    transition: 0,     /* [0,255] integer, the transition part distance */
    radius: 0,         /* [0,50] integer, blur amount(boken radius) */
    brightness: 0,     /* [-1,1] float, boken brightness */
    speed: 1,          /* [1,10] int, the smaller, the slower and the more accurate */
    depthMapPath: '',  /* absolute depth map file path  */
    working: true,     /* slider and input field state, able or disabled */
    rightLoading: false,    /* depth img loading icon state, visible or not visible  */
    leftLoading: false,   /* left(lens blur) img loading icon state, visible or not visible  */
    /* maximum value of transition, that is,  max { minFocalDepth, 255-maxFocalDepth} */
    transMax: 0,
    diaOn: false,
  };

  /**
   * load state before mount (copy from wsw)
   */
  componentWillMount() {
    fs.exists(depthFilename, () => {
      const log = fs.readFileSync(depthFilename);
      const sta = JSON.parse(log);
      this.setState(sta);
    });
  }
  /**
   * save state before out  (copy from wsw)
   */
  componentWillUnmount() {
    if (this.state.working) {
      return;
    }
    const log = JSON.stringify(this.state);
    fs.writeFileSync(depthFilename, log);
  }

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
      });
      this.returnToDefault();
    };

    this.setState({
      fileUrl: files[0].path,  /* refresh img src in left area */
      rightLoading: true,
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
      maxFocalDepth: 255,
      transition: 0,
      radius: 0,
      brightness: 0,
      speed: 1,
      working: false,
      leftLoading: false,
      rightLoading: false,
    });
  }
  /**
   *  function load depth picture in right area
   */
  dropDepthFile=(files) => {
    const depthCallBack = (res) => {
      this.props.setResultImgSrc(res);
      this.setState(() => ({
        fileUrl: res,              /* refresh src in left middle area */
        working: false,            /* set slider to workable */
        leftLoading: false,        /* set loading icon to not visible */
      }));
    };
    this.setState({
      depthMapPath: files[0].path,    /* refresh depth map file path */
    });
    if (this.props.rawImageSrc === '') {
      this.setState({
        working: false,
        leftLoading: false,
      });
    } else if (this.state.radius !== 0) {
      this.setState({
        leftLoading: true,
        working: true,
      });
      lensBlur(this.props.rawImageSrc, files[0].path, this.state.minFocalDepth,
        this.state.maxFocalDepth, this.state.transition, this.state.radius,
        this.state.brightness, this.state.speed, depthCallBack);
    }
  }
  /**
   *  function to change state after calling function lensBlur according to return value
   */
  changeState=(res, type) => {
    console.log(`${type} change res: ${res}`);
    if (res !== undefined) {       /* success to generate an img file */
      this.setState({
        fileUrl: res,              /* refresh img src in middle left area */
      });
      this.props.setResultImgSrc(res);
    } else {
      console.log(`Fail to ${type} change.`);
    }
    this.setState({
      working: false,            /* set slider to workable */
      leftLoading: false,        /* set loading icon to not visible */
    });
  }

  /**
   *  function when moving slider (minFocalDepth and maxFocalDepth)
   */
  onChangeMinMaxFocalDepth = (value) => {
    this.setState({
      minFocalDepth: value[0],
      maxFocalDepth: value[1],
      transMax: (value[0] > (255 - value[1])) ? value[0] : (255 - value[1]),
    });
  }
  /**
   *  function after moving slider (minFocalDepth and maxFocalDepth )
   */
  onAfterChangeMinMaxFocalDepth=(value) => {
    const printMinFunction = (res) => {
      this.changeState(res, 'minMax');
    };
    this.setState({
      minFocalDepth: value[0],
      maxFocalDepth: value[1],
      transMax: (value[0] > (255 - value[1])) ? value[0] : (255 - value[1]),
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        leftLoading: true,
      });
      console.log(value[0]);
      console.log(value[1]);
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, value[0], value[1],
        this.state.transition, this.state.radius, this.state.brightness,
        this.state.speed, printMinFunction);
    }
  }

  /**
   *  function when moving slider and InputNumber (transition)
   */
  onChangeTransition=(value) => {
    this.setState({
      transition: value,
    });
  }
  /**
   *  function after moving slider and InputNumber (transition)
   */
  onAfterChangeTransition=(value) => {
    const printTransitionFunction = (res) => {
      this.changeState(res, 'transition');
    };
    this.setState({
      transition: value,
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        leftLoading: true,
      });
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, this.state.minFocalDepth,
        this.state.maxFocalDepth, value, this.state.radius, this.state.brightness,
        this.state.speed, printTransitionFunction);
    }
  }

  /**
   *  function when moving slider and InputNumber(radius)
   */
  onChangeRadius=(value) => {
    this.setState({
      radius: value,
    });
  }
  /**
   *  function after moving slider (radius)
   */
  onAfterChangeRadius=(value) => {
    const printRadiusFunction = (res) => {
      this.changeState(res, 'radius');
    };
    this.setState({
      radius: value,
      working: true,
      leftLoading: true,
    });
    if (value === 0) {
      this.setState({
        fileUrl: this.props.rawImageSrc,
        working: false,
        leftLoading: false,
      });
    } else {
      lensBlur(this.props.rawImageSrc, this.state.depthMapPath, this.state.minFocalDepth,
        this.state.maxFocalDepth, this.state.transition, value, this.state.brightness,
        this.state.speed, printRadiusFunction);
    }
  }

  /**
   *  function when moving slider and InputNumber (brightness)
   */
  onChangeBrightness=(value) => {
    this.setState({
      brightness: value,
    });
  }

  /**
   *  function after moving slider (brightness)
   */
  onAfterChangeBrightness=(value) => {
    const printBrightnessFunction = (res) => {
      this.changeState(res, 'brightness');
    };
    this.setState({
      brightness: value,
    });
    if (this.state.radius !== 0) {
      this.setState({
        working: true,
        leftLoading: true,
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
    if (this.state.leftLoading) return;
    if (this.state.rightLoading) return;
    if (this.state.diaOn) return;
    this.setState({
      diaOn: true,
    });
    const self = this;
    const printFunction0 = (res) => {
      this.setState({
        depthMapPath: res, /* refresh depth map file path */
        rightLoading: false,
        working: false,
        diaOn: false,
      });
      this.returnToDefault();
    };

    dialog.showOpenDialog({
      properties: ['openFile']
    }, (files) => {
      if (files !== undefined) {
        self.setState({
          fileUrl: files[0],  /* refresh img src in left area */
          rightLoading: true,
          working: true,
        });
        self.props.setResultImgSrc('Not designed');  /* save function, pass parameter to parent component */
        self.props.setRawImgSrc(files[0]);
        const img = new Image();
        img.src = files[0];
        // add image
        self.props.addLeftItem(img.src);
        self.state.imageWidth = img.width;
        self.state.imageHeight = img.height;
        getDepth(files[0], printFunction0);
      } else {
        self.setState({
          diaOn: false,
        });
      }
    });
  }

  /**
   * button clicked: upload right area picture
   */
  uploadRightPic= () => {
    if (this.state.leftLoading) return;
    if (this.state.rightLoading) return;
    if (this.state.diaOn) return;
    this.setState({
      diaOn: true,
    });
    const depthCallBack2 = (res) => {
      this.props.setResultImgSrc(res);
      this.setState(() => ({
        fileUrl: res,                  /* refresh src in left middle area */
        working: false,                /* set slider to workable */
        leftLoading: false,            /* set loading icon to not visible */
        diaOn: false,
      }));
    };
    const self = this;
    dialog.showOpenDialog({
      properties: ['openFile']
    }, (files) => {
      if (files !== undefined) {
        self.setState({
          depthMapPath: files[0],     /* refresh depth map file path */
        });
        if (self.props.rawImageSrc === '') {
          self.setState({
            working: false,
            loading: false,
            diaOn: false,
          });
        } else if (self.state.radius !== 0) {
          self.setState({
            leftLoading: true,
          });
          lensBlur(self.props.rawImageSrc, self.state.depthMapPath, self.state.minFocalDepth,
            self.state.maxFocalDepth, self.state.transition, self.state.radius,
            self.state.brightness, self.state.speed, depthCallBack2);
        }
      } else {
        self.setState({
          diaOn: false,
        });
      }
    });
  }

  /**
   * button clicked: save left area result picture
   */
  saveLeftPic = () => {
    if (this.state.leftLoading) return;
    if (this.state.rightLoading) return;
    if (this.state.diaOn) return;
    this.setState({
      diaOn: true,
    });
    const printFunction = (res) => {
      this.setState({
        diaOn: false,
      });
      alert(`Save in ${res}`);
    };
    if (this.state.fileUrl === '') {
      alert('No image source. Please load an image first.');
      this.setState({
        diaOn: false,
      });
    } else {
      const self = this;
      dialog.showSaveDialog(options, (filename) => {
        if (self.state.fileUrl !== '' && filename !== undefined) {
          saveResult(self.state.fileUrl, filename, printFunction);
        } else {
          self.setState({
            diaOn: false,
          });
        }
      });
    }
  }

  /**
   * button clicked: save right area result picture
   */
  saveRightPic = () => {
    if (this.state.leftLoading) return;
    if (this.state.rightLoading) return;
    if (this.state.diaOn) return;
    const printFunction = (res) => {
      this.setState({
        diaOn: false,
      });
      alert(`Save in ${res}`);
    };
    if (this.state.depthMapPath === '') {
      alert('No image source. Please load an image first.');
    } else {
      this.setState({
        diaOn: true,
      });
      const self = this;
      dialog.showSaveDialog(options, (filename) => {
        if (self.state.depthMapPath !== '' && filename !== undefined) {
          saveResult(self.state.depthMapPath, filename, printFunction);
        } else {
          self.setState({
            diaOn: false,
          });
        }
      });
    }
  }
  /**
   *  min&max focal depth slider tooptip formatter
   */
  formatter = (value) => {
    if (value < this.state.maxFocalDepth) {
      return `Min Focal Depth : ${value}`;
    }
    return `Max Focal Depth : ${value}`;
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <div style={{ height: 'calc(100vh - 64px)', width: 'calc(100vw - 180px)' }}>
        {/* middle img area */}
        <Content style={{ height: 'calc(100% - 118px)' }}>
          {/* import: import depth image */}
          <Row type="flex" justify="start">
            {/* left area */}
            <Col span={9} className={styles.middle_picture}>
              <Button ghost icon="upload" onClick={this.uploadLeftPic} style={{ left: '-4.7vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Import</Button>
              <Button ghost icon="download" onClick={this.saveLeftPic} style={{ left: '4.7vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Export</Button>
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
              <p className={this.state.fileUrl === '' ? styles.RGB : styles.hide}>RGB File</p>
              <Icon type="loading" className={this.state.leftLoading ? styles.loadingStart : styles.hide} spin={this.state.leftLoading} />

            </Col>
            {/* right area */}
            <Col span={9} className={styles.depth_picture_col}>
              <Button ghost icon="upload" onClick={this.uploadRightPic} style={{ left: '-4.7vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Import</Button>
              <Button ghost icon="download" onClick={this.saveRightPic} style={{ left: '4.7vw', margin: '3%', width: '10vw', fontSize: '1.2vw' }}>Export</Button>
              <Dropzone
                style={{ margin: 0, height: 'calc(100vh - 300px)', width: '100%', border: '1px #fff dashed' }}
                onDrop={this.dropDepthFile.bind(this)}
                multiple={false}
                accept="image/*"
              >
                {this.state.depthMapPath === '' ? null :
                <div className={styles.imageDropZone}>
                  <img
                    id="middle_img"
                    style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4) }}
                    src={this.state.depthMapPath}
                    alt="没有图片"
                  />
                </div>}
              </Dropzone>
              <Icon type="plus" className={this.state.depthMapPath === '' ? styles.plus : styles.hide} />
              <p className={this.state.depthMapPath === '' ? styles.depthMap : styles.hide}>Depth Map</p>
              <Icon type="loading" className={this.state.rightLoading ? styles.loadingStart : styles.hide} spin={this.state.rightLoading} />
            </Col>

          </Row>
        </Content>
        {/* tool area */}
        <Row className={styles.footer}>
          <Col span={1} />
          <Col span={10} >
            <p className={styles.minMaxFocalLabel}> Min & Max Focal Depth</p>
            {/* range slider which holds minFocalDepth and maxFocalDepth value */}
            <Slider
              range
              value={[this.state.minFocalDepth, this.state.maxFocalDepth]}
              min={0}
              max={255}
              step={1}
              onChange={this.onChangeMinMaxFocalDepth}
              onAfterChange={this.onAfterChangeMinMaxFocalDepth}
              disabled={this.state.working}
              className={styles.minMaxSlider}
              tipFormatter={this.formatter}
            />
            <p className={styles.minLabel}>0</p>
            <p className={styles.maxLabel}>255</p>

            {/* slider with transition value */}
            <Slider
              min={0}
              max={this.state.transMax}
              step={1}
              onChange={this.onChangeTransition}
              onAfterChange={this.onAfterChangeTransition}
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
            <p className={styles.transitionLabel}>Transition</p>
          </Col>
          <Col span={10}>
            {/* slider with radius value */}
            <Slider
              min={0}
              max={50}
              step={1}
              onChange={this.onChangeRadius}
              onAfterChange={this.onAfterChangeRadius}
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
            <p className={styles.radiusLabel}>Radius</p>
            {/* slider with brightness value */}
            <Slider
              min={-1}
              max={1}
              step={0.1}
              onChange={this.onChangeBrightness}
              onAfterChange={this.onAfterChangeBrightness}
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
            <p className={styles.brightnessLabel}>Brightness</p>

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
            <p className={styles.speedLabel}>Speed</p>
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
