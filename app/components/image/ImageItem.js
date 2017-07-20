/**
 * Created by apple on 2017/7/19.
 */
import React, {Component} from 'react';
import {img} from 'antd';
import pic3 from '../../asset/picture/beach.jpg'
import styles from './ImageItem.css'

class ImageItem extends React.Component {
  render() {
    return (
      <div className={styles.my_div} style={{margin: 0, height: '100%', width: '100%'}}>
        <img src={pic3} height='100%' alt="老掉牙的打字机"></img>
      </div>
    );
  }
}

export default ImageItem;
