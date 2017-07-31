/* eslint-disable no-extend-native */
/**
 * Created by apple on 2017/7/19.
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import LeftMenuItem from './LeftMenuItem';


class LeftMenuList extends Component {
  /**
   * callback show image when user select an item
   * @param e selected index
   */
  handleClick = (e) => {
    this.props.showImage(e.key);
  }

  render() {
    return (
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[this.props.selectedIndex.toString()]}
        style={{ background: '#292929' }}
        onClick={this.handleClick}
      >
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
  delete: React.PropTypes.func.isRequired,
  // show selected image
  showImage: React.PropTypes.func.isRequired,
  selectedIndex: React.PropTypes.number.isRequired
};
