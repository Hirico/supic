/**
 * Created by apple on 2017/7/20.
 */
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Layout, Icon, Row, Col, Tooltip, Button } from 'antd';
import RightMenuList from '../components/menu/RightMenuList';
import LeftMenuList from '../components/menu/LeftMenuList';
import UpMenuSlider from '../components/slider/UpMenuSlider';
import SRSlider from '../components/slider/SRSlider';
import appLogo from '../asset/logo/logo_in_linux.png';
import styles from './DemoPage.css';
import { tempSr } from '../utils/pyCommunicator';


const { Header, Sider, Content, Footer } = Layout;


class App extends Component {
  state = {
    collapsed: false,
    fileUrl: '',
    imageWidth: 20,
    imageHeight: 20,
    slider: 1,
    out_width: 32,
    out_height: 16,
    resizeNum: 1,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  decrement = () => {
    const printFunction = (message) => {
      console.log(message);
    };

    tempSr(this.state.fileUrl, this.state.out_width, this.state.out_height, printFunction);
    const ipcRenderer = require('electron').ipcRenderer;
    const tempDir = ipcRenderer.sendSync('synchronous-message', 'get-temp-dir');
    alert(`Please check ${tempDir} later`);
  };

  dropFile = (files) => {
    this.setState({
      fileUrl: files[0].path,
    });
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

  handleUpSlider = (val) => {
    this.setState({
      resizeNum: val,
    });
  }


  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width="150"
          style={{ background: '#292929' }}
        >
          <div className={styles.logo}>
            <span><img src={appLogo} width={35} height={35} alt="老掉牙的打字机" /></span>
          </div>
          <LeftMenuList />
        </Sider>
        <Layout className={styles.middle_layout} style={{ background: '#1e1e1e' }}>
          <Header className={styles.header}>
            <Tooltip placement="top" title={'slide'}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              /></Tooltip>
            <Tooltip placement="top" title={'open'}><Icon className={styles.trigger} type="plus" /></Tooltip>
            <Tooltip placement="top" title={'clean'}><Icon className={styles.trigger} type="delete" /></Tooltip>
            <Tooltip placement="top" title={'save'}><Icon className={styles.trigger} type="save" /></Tooltip>
            <Col span={1}><UpMenuSlider
              handleUpSlider={this.handleUpSlider.bind(this)}
              min={1}
              max={16}
              value={4}
              icon={['picture', 'picture']}
            /></Col>
            <Tooltip placement="top" title={'more info'}><Icon className={styles.info} type="info-circle" /></Tooltip>
          </Header>

          <Content>
            <Row type="flex" justify="start">
              <Col span={19} className={styles.middle_picture}>
                <Dropzone
                  style={{ margin: 0, height: '100%', width: '100%' }}
                  onDrop={this.dropFile.bind(this)}
                  multiple={false}
                  accept="image/*"
                >
                  {this.state.fileUrl === '' ? null :
                  <div className={styles.imageDropZone}>
                    <img
                      id="middle_img"
                      style={{ margin: 0, height: this.state.resizeNum * 765 / 4 }}
                      src={this.state.fileUrl}
                    />
                  </div>}
                </Dropzone>
              </Col>
              <Col span={4} className={styles.right_list}>
                <RightMenuList />
              </Col>
            </Row>
          </Content>
          <Footer>
            <Row>
              <Col span={19} className={styles.footer}>
                <SRSlider
                  handleSlider={this.handleSlider.bind(this)}
                  min={1}
                  max={8}
                  value={1}
                  pre_width={this.state.imageWidth}
                  pre_height={this.state.imageHeight}
                /><label
                  htmlFor={`${styles.try}`}
                  className={`${styles.note} ${styles.note_label_reso}`}
                >Resize Resolution</label>
                <Icon className={`${styles.zoom} ${styles.footer_icon}`} type="search" />
                <label
                  htmlFor={`${styles.try}`}
                  className={`${styles.note} ${styles.note_label_zoom}`}
                >Magnifier</label>
                <Button
                  onClick={this.decrement}
                  data-tclass="btn"
                  shape="circle"
                  className={`${styles.check_btn}`}
                  icon="check"
                />
                /<label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_check}`}>check</label>

              </Col>
            </Row>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;

