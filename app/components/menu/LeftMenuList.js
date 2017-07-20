/**
 * Created by apple on 2017/7/19.
 */
import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import pic1 from '../../asset/picture/city.jpg'
import pic2 from '../../asset/picture/water.jpg'
import pic3 from '../../asset/picture/beach.jpg'

class LeftMenuList extends React.Component {
    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <Icon type="picture"/>
                    <span><img src={pic1} width={20} height={20} alt="老掉牙的打字机"></img></span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="picture"/>
                    <span><img src={pic2} width={20} height={20} alt="老掉牙的打字机"></img></span>
                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="picture"/>
                    <span><img src={pic3} width={20} height={20} alt="老掉牙的打字机"></img></span>
                </Menu.Item>
            </Menu>
        );
    }
}

export default LeftMenuList;