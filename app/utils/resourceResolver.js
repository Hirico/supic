// @flow
import fs from 'fs';

export default class Resource {

  constructor(dir) {
    this.tempDir = dir;
    this.dispose = () => {
      fs.rmdirSync(this.tempDir);
    };
  }

  init() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }
}
