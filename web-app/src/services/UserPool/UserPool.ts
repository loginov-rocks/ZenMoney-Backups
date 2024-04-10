export interface AuthData {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: 'string';
}

interface Options {
  clientCallbackUrl: string;
  clientId: string;
  domain: string;
}

export class UserPool {
  private readonly clientCallbackUrl: string;

  private readonly clientId: string;

  private readonly domain: string;

  public constructor({ clientCallbackUrl, clientId, domain }: Options) {
    this.clientCallbackUrl = clientCallbackUrl;
    this.clientId = clientId;
    this.domain = domain;
  }

  public async auth(code: string): Promise<AuthData> {
    const url = `https://${this.domain}/oauth2/token`;

    const params = {
      client_id: this.clientId,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.clientCallbackUrl,
    };

    const body = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
    });

    if (!response.ok) {
      throw response;
    }

    const json: AuthData = await response.json();

    return json;
  }

  public loginRedirect(): void {
    const scopes = ['email', 'openid', 'profile'];

    const urlSearchParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.clientCallbackUrl,
      response_type: 'code',
      scope: scopes.join(' '),
    });

    const url = `https://${this.domain}/login?${urlSearchParams.toString()}`;

    window.location.href = url;
  }
}
