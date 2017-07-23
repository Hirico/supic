// @flow
import fs from 'fs-extra';

export default class Resource {

  constructor(dir) {
    this.tempDir = dir;
    this.dispose = () => {
      fs.removeSync(this.tempDir);
    };
  }

  init() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }
}
