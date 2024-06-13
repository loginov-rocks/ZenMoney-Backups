import { AuthData, UserPool } from '../UserPool/UserPool';

export interface Backup {
  fileName: string;
  serverTimestamp: number;
  size: number;
}

interface BackupsCreateUrlResponse {
  url: string;
}

interface BackupsListResponse {
  backups: Backup[];
}

interface Options {
  authDataStorageKey: string;
  baseUrl: string;
  userPoolService: UserPool;
}

interface ZenMoneyAuthRequest {
  zenMoneyAuthCode: string;
}

enum RequestMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Post = 'POST',
}

interface RequestOptions {
  body: string;
}

export class Api {
  private authData: AuthData | null = null;

  private readonly authDataStorageKey: string;

  private readonly baseUrl: string;

  private readonly userPoolService: UserPool;

  public constructor({ authDataStorageKey, baseUrl, userPoolService }: Options) {
    this.authDataStorageKey = authDataStorageKey;
    this.baseUrl = baseUrl;
    this.userPoolService = userPoolService;
  }

  public async backupsCreateUrl(fileName: string): Promise<string> {
    const response = await this.request(RequestMethod.Post, `/backups/${fileName}/url`);
    const json: BackupsCreateUrlResponse = await response.json();

    return json.url;
  }

  public async backupsDelete(fileName: string): Promise<void> {
    await this.request(RequestMethod.Delete, `/backups/${fileName}`);
  }

  public async backupsList(): Promise<Backup[]> {
    const response = await this.request(RequestMethod.Get, '/backups');
    const json: BackupsListResponse = await response.json();

    return json.backups;
  }

  public restoreAuthData(): boolean {
    const storedAuthData = localStorage.getItem(this.authDataStorageKey);

    if (!storedAuthData) {
      return false;
    }

    try {
      const authData = JSON.parse(storedAuthData);
      this.authData = authData;
      console.log('Auth data restored', authData);

      return true;
    } catch (error) {
      console.error('API error when attempting to restore auth data', error);
    }

    return false;
  }

  public storeAuthData(authData: AuthData): void {
    this.authData = authData;
    localStorage.setItem(this.authDataStorageKey, JSON.stringify(authData));
    console.log('Auth data stored', authData);
  }

  public async zenMoneyAuth(zenMoneyAuthCode: string): Promise<void> {
    const request: ZenMoneyAuthRequest = { zenMoneyAuthCode };

    await this.request(RequestMethod.Post, '/zenmoney/auth', {
      body: JSON.stringify(request),
    });
  }

  public async zenMoneyUnauthorize(): Promise<void> {
    await this.request(RequestMethod.Delete, '/zenmoney/auth');
  }

  public async zenMoneyValidateAuth(): Promise<boolean> {
    try {
      await this.request(RequestMethod.Get, '/zenmoney/auth');
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }

      throw error;
    }

    return true;
  }

  private async refreshAuthData(): Promise<void> {
    if (!this.authData) {
      throw new Error('Auth data missing');
    }

    let refreshAuthData;
    try {
      refreshAuthData = await this.userPoolService.refreshToken(this.authData.refresh_token);
    } catch (error) {
      this.removeAuthData();

      throw new Error('Unauthorized');
    }

    this.storeAuthData({
      ...this.authData,
      ...refreshAuthData,
    });
  }

  private removeAuthData() {
    this.authData = null;
    localStorage.removeItem(this.authDataStorageKey);
    console.log('Auth data removed');
  }

  private async request(method: RequestMethod, url: string, options?: RequestOptions): Promise<Response> {
    if (!this.authData) {
      throw new Error('Auth data missing');
    }

    const _url = this.baseUrl + url;
    const init: RequestInit = {
      headers: {
        Authorization: `Bearer ${this.authData.access_token}`,
      },
      method,
    };

    if (method === RequestMethod.Post && options && options.body) {
      init.body = options.body;
      init.headers = {
        ...init.headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await fetch(_url, init);

    if (!response.ok) {
      // Intercept Unauthorized, try to refresh the token and rerun the failed request. Consider improvement: it may
      // issue multiple refresh token requests when multiple requests fail in parallel.
      if (response.status === 401) {
        await this.refreshAuthData();

        return this.request(method, url, options);
      }

      throw response;
    }

    return response;
  }
}
