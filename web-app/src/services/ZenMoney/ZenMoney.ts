interface Options {
  baseUrl: string;
  consumerKey: string;
  redirectUri: string;
}

export class ZenMoney {
  private readonly baseUrl: string;

  private readonly consumerKey: string;

  private readonly redirectUri: string;

  public constructor({ baseUrl, consumerKey, redirectUri }: Options) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.redirectUri = redirectUri;
  }

  public loginRedirect(): void {
    const urlSearchParams = new URLSearchParams({
      client_id: this.consumerKey,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });

    const url = `${this.baseUrl}/oauth2/authorize/?${urlSearchParams.toString()}`;

    window.location.href = url;
  }
}
