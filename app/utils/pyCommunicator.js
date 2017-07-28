// @flow
import zerorpc from 'zerorpc';

const ipcRenderer = require('electron').ipcRenderer;

const client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

// This file is nodejs side machine learning inference api

// general helper function
/**
 * Save the input file to the output location, change format if neccessary.
 * Target format is inferred from the file extension name
 * @param {String} inputFilePath - absolute image file path with extension name
 * @param {String} outputFilePath - absolute image file path with extension name
 * @param {Function} callback - the callback that handles the response, if response
 * begins with '!ERROR', then it's error info, else succeed
 */
export function saveResult(inputFilePath, outputFilePath, callback) {
  client.invoke('save_file', inputFilePath, outputFilePath, (error, res) => {
    callback(res);
  });
}


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
  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    const tempDir = arg;
    client.invoke('predict_sr', inputFilePath, tempDir, outWidth, outHeight, (error, res) => {
      callback(res);
    });
  });
  ipcRenderer.send('asynchronous-message', 'get-temp-dir');
}

/**
 * SR a list of image files to the list of outWidth * outHeight,
 * after each result is generated,
 * a string of the result file path(can be null), a possible error message(can be null),
 * a finished number, a total number will be passed to the specific callback function
 * @param {Array} images - absolute image file paths
 * @param {String} outDir - absolute save directory path
 * @param {Number} outWidths - better be int
 * @param {Number} outHeights - better be int
 * @param {Function} callback - the callback that handles the response
 */
export default function batchSr(images, outDir, outWidths, outHeights, callback) {
  const totalNum = images.length;
  let finishedNum = 0;

  const response = (error, res) => {
    finishedNum += 1;
    if (res.indexOf('!ERROR') !== -1) {
      callback(null, res, finishedNum, totalNum);
    } else {
      callback(res, null, finishedNum, totalNum);
    }
  };

  for (let i = 0; i < totalNum; i += 1) {
    client.invoke('predict_sr', images[i], outDir, outWidths[i], outHeights[i], response);
  }
}


// mono-depth

/**
 * Obtain the depth image of the given image. After the result is generated,
 * a string of the result file path is passed to the specific callback function
 * @param {String} inputFilePath - absolute image file path
 * @param {Function} callback - the callback that handles the response
 */
export function getDepth(inputFilePath, callback) {
  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    const tempDir = arg;
    client.invoke('predict_depth', inputFilePath, tempDir, (error, res) => {
      callback(res);
    });
  });
  ipcRenderer.send('asynchronous-message', 'get-temp-dir');
}

