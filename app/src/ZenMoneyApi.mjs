export class ZenMoneyApi {
  constructor({ baseUrl, consumerKey, consumerSecret, redirectUri }) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.redirectUri = redirectUri;
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

    const json = await response.json();

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
