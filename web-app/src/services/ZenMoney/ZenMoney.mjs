export class ZenMoney {
  constructor({ baseUrl, consumerKey, redirectUri }) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.redirectUri = redirectUri;
  }

  loginRedirect() {
    const urlSearchParams = new URLSearchParams({
      client_id: this.consumerKey,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });

    const url = `${this.baseUrl}/oauth2/authorize/?${urlSearchParams.toString()}`;

    window.location.href = url;
  }
}
