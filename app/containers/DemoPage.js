/**
 * Created by apple on 2017/7/20.
 */

import React, {Component} from 'react';
import {Layout, Icon, Col, Tooltip} from 'antd';
import {HashRouter} from 'react-router-dom';
import LeftMenuList from '../components/menu/LeftMenuList';
import RightMenuList from '../components/menu/RightMenuList';
import UpMenuSlider from '../components/slider/UpMenuSlider';
import appLogo from '../asset/logo/logo_in_linux.png';
import styles from './DemoPage.css';

import RightRouter from '../router/RightRouter';
import SRSingle_IT from "../components/imageAndTool/SRSingle_IT";
import Lens_IT from "../components/imageAndTool/Lens_IT";


const {Header, Sider} = Layout;

class App extends Component {
  state = {
    collapsed: false,
    resolutionSelected: true,
    depthSelected: false,
    styleSelected: false,
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

  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width="150"
          style={{background: '#292929'}}
        >
          <div className={styles.logo}>
            <span><img src={appLogo} width={35} height={35} alt="老掉牙的打字机"/></span>
          </div>
          <LeftMenuList/>
        </Sider>
        <Layout className={styles.middle_layout} style={{background: '#1e1e1e'}}>
          <Header className={styles.header}>
            <Tooltip placement="top" title={'slide'}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              /></Tooltip>
            <Tooltip placement="top" title={'open'}><Icon className={styles.trigger} type="plus"/></Tooltip>
            <Tooltip placement="top" title={'clean'}><Icon className={styles.trigger} type="delete"/></Tooltip>
            <Tooltip placement="top" title={'save'}><Icon className={styles.trigger} type="save"/></Tooltip>
            <Col span={1}><UpMenuSlider min={100} max={400} value={100} icon={['picture', 'picture']}/></Col>
            <Tooltip placement="top" title={'more info'}><Icon className={styles.info} type="info-circle"/></Tooltip>
          </Header>

          <RightMenuList selectMode={this.selectMode.bind(this)}/>
          {this.state.resolutionSelected ? <SRSingle_IT/> : this.state.depthSelected ? <Lens_IT/> : null}
          {/* <HashRouter> */}
          {/* <RightRouter /> */}
          {/* </HashRouter> */}
        </Layout>
      </Layout>
    );
  }
}

export default App;

