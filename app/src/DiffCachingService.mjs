import fs from 'fs';
import path from 'path';

export class DiffCachingService {
  constructor({ zenMoneyApi }) {
    this.zenMoneyApi = zenMoneyApi;

    this.diffCache = new Map();
  }

  async diff(accessToken) {
    if (process.env.NODE_ENV !== 'production') {
      return this._diffMock();
    }

    if (!this.diffCache.has(accessToken)) {
      const promise = this.zenMoneyApi.diff(accessToken);

      this.diffCache.set(accessToken, promise);
    }

    const diff = await this.diffCache.get(accessToken);

    return diff;
  }

  /**
   * @private
   */
  _diffMock() {
    const diffString = fs.readFileSync(path.resolve('./src/ZenMoneyApi/__fixtures__/diff.json')).toString();
    const diffMock = JSON.parse(diffString);

    return Promise.resolve(diffMock);
  }
}
