/**
 * Created by apple on 2017/7/20.
 */
import React, { Component } from 'react';
import { Layout, Icon, Row, Col } from 'antd';
import ImageItem from '../components/image/ImageItem';
import RightMenuList from '../components/menu/RightMenuList';
import LeftMenuList from '../components/menu/LeftMenuList';
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
          width="100"
        >
          <div className={styles.logo} />
          <LeftMenuList />
        </Sider>
        <Layout className={styles.middle_layout}>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Icon className={styles.trigger} type="plus" />
            <Icon className={styles.trigger} type="delete" />
            <Icon className={styles.trigger} type="save" />
          </Header>

          <Content>
            <Row type="flex" justify="start">
              <Col
                span={19}
                className={styles.middle_picture}
              >
                <ImageItem />
              </Col>
              <Col span={4} className={styles.right_list}>
                <RightMenuList />
              </Col>
            </Row>
          </Content>
          <Footer className={styles.footer}>
            !!!这里怎么写orz!!!
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
