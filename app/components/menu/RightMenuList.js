/**
 * Created by apple on 2017/7/19.
 */
import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';
import styles from './RightMenuList.css';

const SubMenu = Menu.SubMenu;

class RightMenuList extends Component {
  state = {
    current: '1',
    openKeys: [],
  }
  handleClick = (e) => {
    // alert("hello" + e.key);
    if (e.key === '1') {
      this.props.selectMode(1);
    } else if (e.key === '2') {
      this.props.selectMode(1);
    } else if (e.key === '3') {
      this.props.selectMode(2);
    } else if (e.key === '4') {
      this.props.selectMode(2);
    } else if (e.key === '5') {
      this.props.selectMode(3);
    }
    console.log('Hello Clicked: ', e);
    this.setState({current: e.key});
  }
  onOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({openKeys: nextOpenKeys});
  }
  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }

  render() {
    return (
      <div className={styles.right_list}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[this.state.current]}
          style={{width: 'auto', background: '#1e1e1e'}}
          onOpenChange={this.onOpenChange}
          onClick={this.handleClick}
          inlineIndent="10"
        >
          <SubMenu key="sub1" title={<span><Icon type="mail"/><span>Resolution</span></span>}>
            <Menu.Item key="1">Single Super</Menu.Item>
            <Menu.Item key="2">Multiple Super</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2"
                   title={<span><Icon type="appstore"/><span>FocusDepth&nbsp;&nbsp;&nbsp;&nbsp;</span></span>}>
            <Menu.Item key="3">Normal</Menu.Item>
            <Menu.Item key="4">For Expert</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" title={<span><Icon type="setting"/><span>Stylize&nbsp;</span></span>}>
            <Menu.Item key="5">Stylize Export</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default RightMenuList;
