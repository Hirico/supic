// @flow
import zerorpc from 'zerorpc';

const ipcRenderer = require('electron').ipcRenderer;

const client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

// This file is nodejs side machine learning inference api

// single image super-resolution

/**
 * SR a given image file to outWidth * outHeight, after the result is generated,
 * a string of the result file path is passed to the specific callback function
 * @param {String} inputFilePath - absolute image file path
 * @param {Number} outWidth - better be int
 * @param {Number} outHeight - better be int
 * @param {Function} callback - the callback that handles the response
 */
export function tempSr(inputFilePath, outWidth, outHeight, callback) {
  const tempDir = ipcRenderer.sendSync('synchronous-message', 'get-temp-dir');
  console.log(tempDir);
  client.invoke('predict_sr', inputFilePath, tempDir, outWidth, outHeight, (error, res) => {
    callback(res);
  });
}

export function saveResult() {
  // TODO args: tempFilePath, savePath
  return 'haha';
}

// batch process super-resolution

export default function batchSr() {
  // TODO
}

