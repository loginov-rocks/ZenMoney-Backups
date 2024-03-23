export class Api {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  auth(zenMoneyAuthCode) {
    const url = `${this.baseUrl}/auth`;

    return fetch(url, {
      body: JSON.stringify({ zenMoneyAuthCode }),
      headers: {
        Authorization: `Bearer ${this.authData.access_token}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  }

  async getAuth() {
    const url = `${this.baseUrl}/auth`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.authData.access_token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }

      throw response;
    }

    return true;
  }

  async list() {
    const url = `${this.baseUrl}/list`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.authData.access_token}`,
      },
    });

    if (!response.ok) {
      throw response;
    }

    const json = await response.json();

    return json;
  }

  restoreAuthData() {
    const storedAuthData = localStorage.getItem('authData');

    if (!storedAuthData) {
      return false;
    }

    try {
      const authData = JSON.parse(storedAuthData);

      this.authData = authData;

      console.log('Auth data restored', authData);

      return true;
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  storeAuthData(authData) {
    this.authData = authData;

    localStorage.setItem('authData', JSON.stringify(authData));

    console.log('Auth data stored', authData);
  }
}
