/* eslint-disable no-extend-native */
/**
 * Created by apple on 2017/7/19.
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import LeftMenuItem from './LeftMenuItem';


class LeftMenuList extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ background: '#292929' }}>
        {
          // lambda to get all element in list
          this.props.images.map((item, i) => (
            <Menu.Item key={i.toString()}>
              <Icon type="picture" />
              <span><LeftMenuItem path={item} index={i} delete={this.props.delete} /></span>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }
}

export default LeftMenuList;

LeftMenuList.propTypes = {
  images: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  delete: React.PropTypes.func.isRequired
};
