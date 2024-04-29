export class ZenMoneyApi {
  constructor({ baseUrl, redirectUri }) {
    this.baseUrl = baseUrl;
    this.redirectUri = redirectUri;
  }

  setConsumerKey(consumerKey) {
    this.consumerKey = consumerKey;
  }

  setConsumerSecret(consumerSecret) {
    this.consumerSecret = consumerSecret;
  }

  /**
   * @see https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#diff
   */
  async diff(accessToken) {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('Consumer key or secret missing');
    }

    const url = `${this.baseUrl}/v8/diff`;

    const body = JSON.stringify({
      currentClientTimestamp: Math.round(Date.now() / 1000),
      serverTimestamp: 0,
    });

    const response = await fetch(url, {
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    });

    let json;
    try {
      json = await response.json();
    } catch (error) {
      console.error(error);
    }

    if (!response.ok) {
      const { status, statusText } = response;

      throw { json, status, statusText };
    }

    return json;
  }
}
