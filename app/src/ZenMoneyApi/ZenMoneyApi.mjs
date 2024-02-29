export class ZenMoneyApi {
  constructor({ baseUrl, consumerKey, consumerSecret, redirectUri }) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.redirectUri = redirectUri;
  }

  async diff(accessToken) {
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

  async token(code) {
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
