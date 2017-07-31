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

// add by wsw for current test
// TODO will delete before construct
const pic2 = '/Users/wshwbluebird/ML/supic/app/asset/picture/water.jpg';
const pic3 = '/Users/wshwbluebird/ML/supic/app/asset/picture/beach.jpg';
const pic1 = '/Users/wshwbluebird/ML/supic/app/asset/picture/city.jpg';

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
    rawImageSrc: '', // 原图像的路径
    imageSrc: 'Not designed', // 产出结果图像的路径
    resizeNum: 4,
    images: [pic1, pic2, pic3], // images in left menu
    selectedIndex: 0          // selected index in left menu
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

  getRawImgSrc = (val) => {
    this.setState({
      rawImageSrc: val,
    });
  }

  savePicture = () => {
    const printFunction = (res) => {
      alert(`Save in ${res}`);
    };
    if (this.state.imageSrc === 'Not designed') {
      alert('No image source. Please create a SR image first.');
    } else {
      const self = this;
      dialog.showSaveDialog(options, (filename) => {
        if (self.state.imageSrc === 'Not designed') {
          alert('No image source. Please create a SR image first.');
        } else if (filename === undefined) {
          alert('No designed path. Please choose a path to save.');
        } else {
          saveResult(self.state.imageSrc, filename, printFunction);
        }
      });
    }
  }

  /**
   * delete all pictures in left menu
   * @author wsw
   */
  clearAll= () => {
    this.setState({
      images: [],
      rawImageSrc: null,
      selectedIndex: 0
    });
  }

  /**
   * delete the selected picture in left menu
   * @param index the index of the selected picture in the array
   * @author wsw
   */
  deleteItem = (index) => {
    const list = this.state.images;
    // delete the index element in the array
    list.splice(index, 1);
    // reset the props state
    this.setState({ images: list });
  }
  /**
   * add a new picture item in left menu list
   * @param imageURL  the image user put into the zone
   */
  addItem = (imageURL) => {
    const list = this.state.images;
    // add a new item in the array
    list.push(imageURL);
    // reset the props state
    this.setState({ images: list,
      selectedIndex: list.length - 1
    });
  }
  /**
   * show a picture in the drop zone when user select in the left
   * @param index
   */
  changeShowImage = (index) => {
    index = index < this.state.images.length ? index : this.state.images.length - 1;
    this.setState({ rawImageSrc: this.state.images[index],
      selectedIndex: index });
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
          <LeftMenuList
            images={this.state.images}
            delete={this.deleteItem}
            showImage={this.changeShowImage}
            selectedIndex={this.state.selectedIndex}
          />
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
            <Tooltip placement="top" title={'clean'}>
              <Icon
                className={styles.trigger}
                type="delete"
                onClick={this.clearAll}
              />
            </Tooltip>
            <Button onClick={this.savePicture} className={styles.btn}>
              <Tooltip placement="top" title={'save'}><Icon type="save" className={styles.trigger} /> </Tooltip>
            </Button>
            <Col span={1}><UpMenuSlider
              changeUpSlider={this.changeUpSlider.bind(this)}
              min={2}
              max={8}
              value={4}
              icon={['picture', 'picture']}
            /></Col>
            <Tooltip placement="top" title={'more info'}><Icon className={styles.info} type="info-circle" /></Tooltip>
          </Header>

          <RightMenuList selectMode={this.selectMode.bind(this)} />

          {this.state.resolutionSelected ? <ResolutionSingleImageTool
            resizeNum={this.state.resizeNum}
            getImgSrc={this.getImgSrc.bind(this)}
            getRawImgSrc={this.getRawImgSrc.bind(this)}
            rawImageSrc={this.state.rawImageSrc}
            addLeftItem={this.addItem.bind(this)}
          /> : null}
          {this.state.depthSelected ? <DepthNormalImageTool
            resizeNum={this.state.resizeNum}
            getRawImgSrc={this.getRawImgSrc.bind(this)}
            rawImageSrc={this.state.rawImageSrc}
            addLeftItem={this.addItem.bind(this)}
            getImgSrc={this.getImgSrc.bind(this)}
          /> : null}

        </Layout>
      </Layout>
    );
  }
}

export default App;

