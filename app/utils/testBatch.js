/**
 * Created by wshwbluebird on 2017/8/2.
 */
/**
 * SR a list of image files to the list of outWidth * outHeight,
 * after each result is generated,
 * a string of the result file path(can be null), a possible error message(can be null),
 * a finished number, a total number will be passed to the specific callback function
 * @param {Array} images - absolute image file paths
 * @param {String} outDir - absolute save directory path
 * @param {Array} outWidths - better be int
 * @param {Array} outHeights - better be int
 * @param {Array} picTypes - number values from PicType
 * @param {Function} callback - the callback that handles the response
 */
export default function batchSr(images, outDir, outWidths, outHeights, picTypes, callback) {
  const totalNum = images.length;

  for (let i = 0; i < totalNum; i += 1) {
    setTimeout(() => {
      console.log('dfd');
      if (i % 2 === 0) {
        callback(null, 'good', i + 1, totalNum);
      } else {
        callback('bad', null, i + 1, totalNum);
      }
    }, (i + 1) * 1000);
  }
}
