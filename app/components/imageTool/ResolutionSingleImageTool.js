import React, { Component } from 'react';
import { Layout, Icon, Row, Col, Button, Select } from 'antd';
import Dropzone from 'react-dropzone';
import SuperResolutionSlider from '../slider/SuperResolutionSlider';
import { tempSr } from '../../utils/pyCommunicator';
import styles from './ResolutionSingleImageTool.css';
import MutipleSelector from '../Selector/MultipleSelector';


const { Content, Footer } = Layout;
const Option = Select.Option;

class ResolutionSingleImageTool extends Component {
  state = {
    imageWidth: 20,
    imageHeight: 20,
    slider: 1,
    out_width: 32,
    out_height: 16,
    resultFileUrl: '',
    loading: false,
    picType: '',
  };

  selectPicType = (type) => {
    this.setState({
      picType: type,
    });
    alert(type);
  }

  getSrPicture = () => {
    const printFunction = (message) => {
      this.props.setResultImgSrc(message);
      this.setState({
        resultFileUrl: message,
        loading: false,
      });
      alert(`New picture save in ${message} temporarily. Click SAVE BUTTON to designated route if you like it.`);
      alert(this.state.resultFileUrl);
    };
    this.setState({
      loading: true,
    });
    tempSr(this.props.rawImageSrc, this.state.out_width, this.state.out_height, this.state.picType,
      printFunction);

    // const OpenWindow = window.open('', '处理进度', 'height=100, width=400, top=0,' +
    //   ' left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
  };

  dropFile = (files) => {
    this.props.setRawImgSrc(files[0].path);
    this.props.setResultImgSrc('Not designed');
    const img = new Image();
    img.src = files[0].path;
    img.onload = () => {
      this.setState({ imageHeight: img.height, imageWidth: img.width });
      this.props.addLeftItem(img.src);
    };
  };


  handleSlider = (val1, val2) => {
    this.setState({
      out_width: val1,
      out_height: val2,
    });
  }

  render() {
    // if user select multiple SR change layout totally
    if (this.props.modeSelect === 2) {
      return (
        <div style={this.props.collapsed ? { height: 'calc(100vh - 64px)',
          width: 'calc(100vw - 64px)' } : { height: 'calc(100vh - 64px)', width: 'calc(100vw - 150px)' }}
        >
          <MutipleSelector />
        </div>
      );
    }

    return (
      <div style={this.props.collapsed ? {
        height: 'calc(100vh - 85px)',
        width: 'calc(100vw - 310px)'
      } : { height: 'calc(100vh - 85px)', width: 'calc(100vw - 390px)', margin: 20 }}
      >
        <Content style={{ height: 'calc(100% - 118px)' }}>
          <Row type="flex" justify="start" style={{ height: '100%' }}>
            <Col
              span={this.state.resultFileUrl === '' ? 24 : 12}
              className={styles.middle_picture}
              style={{ height: '100%' }}
            >
              <Dropzone
                style={{ margin: 0, height: '100%', width: '100%' }}
                onDrop={this.dropFile.bind(this)}
                multiple={false}
                accept="image/*"
              >
                {this.props.rawImageSrc === '' ? <div className={styles.dropWord} >Drop or click to upload</div> :
                <div className={styles.imageDropZone}>
                  <img
                    id="middle_img"
                    style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4) }}
                    src={this.props.rawImageSrc}
                    alt="没有图片"
                  />
                </div>}
              </Dropzone>
            </Col>

            {this.state.resultFileUrl === '' ? null :
            <Col span={12} className={styles.middle_picture} style={{ height: '100%' }}>
              <img
                id="middle_img"
                style={{ margin: 0, height: ((450 * this.props.resizeNum) / 4) }}
                src={this.state.resultFileUrl}
                alt="没有图片"
              />
            </Col>}
          </Row>
        </Content>
        <Footer>
          <Row>
            <Col span={23} className={styles.footer}>
              <SuperResolutionSlider
                handleSlider={this.handleSlider.bind(this)}
                min={1}
                max={2}
                step={0.1}
                value={1}
                pre_width={this.state.imageWidth}
                pre_height={this.state.imageHeight}
              />
              <Button
                onClick={this.getSrPicture}
                data-tclass="btn"
                shape="circle"
                className={`${styles.check_btn}`}
                icon="check"
              />
              <Select defaultValue="TEXT" className={`${styles.selectCategory}`} onChange={this.selectPicType}>
                <Option value="ANIME">ANIME</Option>
                <Option value="TEXT">TEXT</Option>
                <Option value="PORTRAIT">PORTRAIT</Option>
              </Select>
            </Col>
            <Col span={1} className={styles.footer}>
              <Icon
                type="loading"
                className={this.state.loading ? styles.loadingStart : styles.loadingStop}
                spin={this.state.loading}
              />
            </Col>
          </Row>
        </Footer>
      </div>

    );
  }
}

export default ResolutionSingleImageTool;
ResolutionSingleImageTool.propTypes = {
  rawImageSrc: React.PropTypes.string.isRequired,
  resizeNum: React.PropTypes.number.isRequired,
  setResultImgSrc: React.PropTypes.func.isRequired,
  setRawImgSrc: React.PropTypes.func.isRequired,
  // {callback} add a small item in left menu when drop a file in drop zone
  addLeftItem: React.PropTypes.func.isRequired,
  // the select mode in SR mutiple or single
  modeSelect: React.PropTypes.number.isRequired,
  collapsed: React.PropTypes.bool.isRequired,
};
