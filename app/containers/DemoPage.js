/**
 * Created by apple on 2017/7/20.
 */

import React, { Component } from 'react';
import { Layout, Icon, Col, Tooltip, Button } from 'antd';
import LeftMenuList from '../components/menu/LeftMenuList';
import RightMenuList from '../components/menu/RightMenuList';
import UpMenuSlider from '../components/slider/UpMenuSlider';
import appLogo from '../asset/logo/logo_in_linux.png';
import styles from './DemoPage.css';

import ResolutionSingleImageTool from '../components/imageTool/ResolutionSingleImageTool';
import DepthNormalImageTool from '../components/imageTool/DepthNormalImageTool';

import { saveResult } from '../utils/pyCommunicator';

const { Header, Sider } = Layout;
const dialog = require('electron').remote.dialog;

const options = {
  title: 'Save an Image',
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif', 'ico', 'icns'] }
  ]
};

class App extends Component {
  state = {
    collapsed: false,
    resolutionSelected: true,
    depthSelected: false,
    styleSelected: false,
    imageSrc: 'Not designed',
    resizeNum: 4,
  };

  selectMode = (var1) => {
    if (var1 === 1) {
      this.setState({
        resolutionSelected: true,
        depthSelected: false,
        styleSelected: false,
      });
    } else if (var1 === 2) {
      this.setState({
        resolutionSelected: false,
        depthSelected: true,
        styleSelected: false,
      });
    } else if (var1 === 3) {
      this.setState({
        resolutionSelected: false,
        depthSelected: false,
        styleSelected: true,
      });
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  getImgSrc = (val) => {
    this.setState({
      imageSrc: val,
    });
  }

  savePicture=() => {
    const printFunction = (res) => {
      alert('Save in ', res);
    };
    if (this.state.imageSrc === 'Not designed') {
      alert('No image source. Please create a SR image first.');
    } else {
      const self = this;
      dialog.showSaveDialog(options, (filename) => {
        if (self.state.imageSrc === ' Not designed') {
          alert('No image source. Please create a SR image first.');
        } else if (filename === undefined) {
          alert('No designed path. Please choose a path to save.');
        } else {
          saveResult(self.state.imageSrc, filename, printFunction);
        }
      });
    }
  }


  changeUpSlider = (v) => {
    this.setState({
      resizeNum: v,
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
            <Button onClick={this.savePicture} className={styles.btn}>
              <Tooltip placement="top" title={'save'}><Icon type="save" className={styles.trigger} /> </Tooltip>
            </Button>
            <Col span={1}><UpMenuSlider
              changeUpSlider={this.changeUpSlider.bind(this)}
              min={1}
              max={16}
              value={4}
              icon={['picture', 'picture']}
            /></Col>
            <Tooltip placement="top" title={'more info'}><Icon className={styles.info} type="info-circle" /></Tooltip>
          </Header>

          <RightMenuList selectMode={this.selectMode.bind(this)} />

          {this.state.resolutionSelected ? <ResolutionSingleImageTool
            resizeNum={this.state.resizeNum}
            getImgSrc={this.getImgSrc.bind(this)}
          /> : null}
          {this.state.depthSelected ? <DepthNormalImageTool /> : null}

        </Layout>
      </Layout>
    );
  }
}

export default App;

