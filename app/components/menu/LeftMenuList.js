/* eslint-disable no-extend-native */
/**
 * Created by apple on 2017/7/19.
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import LeftMenuItem from './LeftMenuItem';

const pic2 = '/Users/wshwbluebird/ML/supic/app/asset/picture/water.jpg';
const pic3 = '/Users/wshwbluebird/ML/supic/app/asset/picture/beach.jpg';
const pic1 = '/Users/wshwbluebird/ML/supic/app/asset/picture/city.jpg';

class LeftMenuList extends Component {

  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.state = {
      imageList: [pic1, pic2, pic3]
    };
  }

  /**
   * a function deliver to child component
   * @param index
   */
  delete(index) {
    const list = this.state.imageList;
    // delete the index element in the array
    list.splice(index, 1);
    // reset the props state
    this.setState({ imageList: list });
  }

  render() {
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ background: '#292929' }}>
        {
          // lambda to get all element in list
          this.state.imageList.map((item, i) => (
            <Menu.Item key={i.toString()}>
              <Icon type="picture" />
              <span><LeftMenuItem path={item} index={i} delete={this.delete} /></span>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }
}

export default LeftMenuList;
