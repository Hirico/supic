/**
 * The type of user's input image, chosen by user, used to specify super resolution task
 * Usage:
 * import PicType from (this js file);
 * type = PicType.TEXT;
 * tempSr(..., type, ...);
 */

const PicType = {
  ANIME: 0,
  TEXT: 1,
  PORTRAIT: 2
};

Object.freeze(PicType);
export default PicType;
