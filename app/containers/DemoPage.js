/**
 * Created by apple on 2017/7/20.
 */
import React, { Component } from 'react';
import { Layout, Icon, Row, Col, Tooltip } from 'antd';
import ImageItem from '../components/image/ImageItem';
import RightMenuList from '../components/menu/RightMenuList';
import LeftMenuList from '../components/menu/LeftMenuList';
import UpMenuSlider from '../components/slider/UpMenuSlider';
import SRSlider from '../components/slider/SRSlider';
import appLogo from '../asset/logo/logo_in_linux.png';
import styles from './DemoPage.css';


const { Header, Sider, Content, Footer } = Layout;


class App extends Component {
  state = {
    collapsed: false,
  };
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
            <UpMenuSlider min={100} max={400} value={100} icon={['picture', 'picture']} />
            <Tooltip placement="top" title={'more info'}><Icon className={styles.info} type="info-circle" /></Tooltip>
          </Header>

          <Content>
            <Row type="flex" justify="start">
              <Col span={19} className={styles.middle_picture}>
                <ImageItem />
              </Col>
              <Col span={4} className={styles.right_list}>
                <RightMenuList />
              </Col>
            </Row>
          </Content>
          <Footer>
            <Row>
              <Col span={19} className={styles.footer}>
                <SRSlider min={2} max={16} value={8} /><label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_reso}`}>Resize Resolution</label>
                <Icon className={`${styles.zoom} ${styles.footer_icon}`} type="search" /><label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_zoom}`}>Magnifier</label>
                <Icon className={`${styles.check} ${styles.footer_icon}`} type="check-circle" /><label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_check}`}>check</label>

              </Col>
            </Row>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;

