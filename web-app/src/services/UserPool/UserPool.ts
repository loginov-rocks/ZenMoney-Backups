export interface AuthData {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: 'string';
}

interface RefreshAuthData {
  access_token: string;
  expires_in: number;
  id_token: string;
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

  public auth(code: string): Promise<AuthData> {
    return this.request<AuthData>({
      code,
      grant_type: 'authorization_code',
    });
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

  public refreshToken(refreshToken: string): Promise<RefreshAuthData> {
    return this.request<RefreshAuthData>({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
  }

  private async request<ResponseType>(parameters: Record<string, string>): Promise<ResponseType> {
    const url = `https://${this.domain}/oauth2/token`;

    const params = {
      ...parameters,
      client_id: this.clientId,
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

    return response.json();
  }
}
