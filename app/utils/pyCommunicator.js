// @flow
import zerorpc from 'zerorpc';

const ipcRenderer = require('electron').ipcRenderer;

const client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

// This file is nodejs side machine learning inference api, mixed with python image API

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


// image super-resolution

/**
 * SR a given image file to outWidth * outHeight, after the result is generated,
 * a string of the result file path is passed to the specific callback function
 * @param {String} inputFilePath - absolute image file path
 * @param {Number} outWidth - better be int
 * @param {Number} outHeight - better be int
 * @param {Function} callback - the callback that handles the response
 */
export function tempSr(inputFilePath, outWidth, outHeight, callback) {
  ipcRenderer.once('asynchronous-reply', (event, arg) => {
    const tempDir = arg;
    client.invoke('predict_sr', inputFilePath, tempDir, outWidth, outHeight, (error, res) => {
      console.log(res);
      console.log(`err: ${error}`);
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
  ipcRenderer.once('asynchronous-reply', (event, arg) => {
    const tempDir = arg;
    client.invoke('predict_depth', inputFilePath, tempDir, (error, res) => {
      callback(res);
    });
  });
  ipcRenderer.send('asynchronous-message', 'get-temp-dir');
}

/**
 * Apply a simulated "lens blur" filter to the given image, the blur amount
 * is gradient according to the distance to the focal plane([minFocalDepth,
 * maxFocalDepth]). The transition plane is blurred less obviously than out-of
 * -focus area.
 * After the result is generated,
 * a string of the result file path is passed to the specific callback function
 * @param {String} inputFilePath - absolute image file path
 * @param {String} depthMapPath - absolute depth map file path
 * @param {Number} minFocalDepth- [0,255] integer, the closest focal distance
 * @param {Number} maxFocalDepth - [0,255] interger, the farthest focal distance
 * @param {Number} transition - [0,255] integer, the transition part distance
 * (symmetrically closer than minFocal and farther than maxFocal)
 * @param {Number} radius - [0,50] integer, blur amount(boken radius)
 * @param {Number} brightness - [-1,1] float, boken brightness
 * @param {Number} speed - [1,10] int, the smaller, the slower and the more accurate
 * @param {Function} callback - the callback that handles the response
 */
export function lensBlur(inputFilePath, depthMapPath, minFocalDepth, maxFocalDepth,
  transition, radius, brightness, speed, callback) {
  ipcRenderer.once('asynchronous-reply', (event, arg) => {
    const tempDir = arg;
    client.invoke('lens_blur', inputFilePath, depthMapPath, minFocalDepth, maxFocalDepth,
      transition, radius, brightness, tempDir, speed, (error, res) => {
        callback(res);
      });
  });
  ipcRenderer.send('asynchronous-message', 'get-temp-dir');
}

