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
   * @see https://github.com/zenmoney/ZenPlugins/wiki/ZenMoney-API#авторизация-
   */
  async tokens(code) {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('Consumer key or secret missing');
    }

    const url = `${this.baseUrl}/oauth2/token`;

    const body = new URLSearchParams({
      client_id: this.consumerKey,
      client_secret: this.consumerSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    }).toString();

    const response = await fetch(url, {
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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

    return {
      accessToken: json.access_token,
      expiresIn: json.expires_in,
      refreshToken: json.refresh_token,
      tokenType: json.token_type,
    };
  }
}
