 import React, { Component } from 'react';
 import {Layout, Icon, Row, Col, Tooltip, Button} from 'antd';
 import { app } from 'electron';
 import Dropzone from 'react-dropzone';
 import ImageItem from '../image/ImageItem';
 import SRSlider from '../slider/SRSlider';
 import { tempSr } from '../../utils/pyCommunicator';
 import styles from './SRSingle_IT.css';


const {Header, Sider, Content, Footer} = Layout;

 class SRSingle_IT extends Component{
 	state = {
    fileUrl: '',
    imageWidth: 20,
    imageHeight: 20,
    slider:1,
    out_width:32,
    out_height:16,
  };

  decrement = () => {
    const printFunction = (message) => {
      console.log(message);
    };

    tempSr(this.state.fileUrl, this.state.out_width, this.state.out_height, printFunction);
    const ipcRenderer = require('electron').ipcRenderer;
    const tempDir = ipcRenderer.sendSync('synchronous-message', 'get-temp-dir');
    alert('Please check ' +tempDir + ' later');
  };

  dropFile = (files) => {
    this.setState({
      fileUrl: files[0].path,
    });
    let img = new Image();
    img.src = files[0].path;
    //img.onload = function () {
    this.state.imageWidth = img.width;
    this.state.imageHeight = img.height;
    // alert('width:' + img.width + ',height:' + img.height);
    //};
    // console.log(‘Received files: ‘, files[0]);
    // console.log(this.state.fileUrl);
  };


  handleSlider=(val1,val2) => {
    this.setState({
      out_width:val1,
      out_height:val2,
    });

  }

 	render(){
 		return(
 			<div>
 			<Content>
            <Row type="flex" justify="start">
              <Col span={19} className={styles.middle_picture}>
                <Dropzone style={{ margin: 0, height: '100%', width: '100%' }}
                          onDrop={this.dropFile.bind(this)}
                          multiple={false}
                          accept="image/*">
                  <div style={{ color:'#d9d9d9' ,fontSize:'15px'}}>Drop an image or click to select a file to upload.</div>
                  {this.state.fileUrl === '' ? null :
                    <div className={styles.imageDropZone}>
                      <p>{this.state.fileUrl}</p>
                      <img id="middle_img" style={{ margin: 0, height: '100%' }} src={this.state.fileUrl}
                      />
                    </div>}
                </Dropzone>
              </Col>
            
            </Row>
          </Content>
          <Footer>
            <Row>
              <Col span={19} className={styles.footer}>
                <SRSlider handleSlider={this.handleSlider.bind(this)} min={1} max={8} value={1} pre_width={this.state.imageWidth }
                          pre_height={this.state.imageHeight}/><label htmlFor={`${styles.try}`}
                className={`${styles.note} ${styles.note_label_reso}`}>Resize Resolution</label>
                <Icon className={`${styles.zoom} ${styles.footer_icon}`} type="search" />
                <label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_zoom}`}>Magnifier</label>
                <Button onClick={this.decrement} data-tclass="btn" shape="circle" className={`${styles.check_btn}`}  icon="check" />
                /<label htmlFor={`${styles.try}`} className={`${styles.note} ${styles.note_label_check}`}>check</label>
              </Col>
            </Row>
          </Footer>
          </div>

 		);
 	}
 }
 export default SRSingle_IT;