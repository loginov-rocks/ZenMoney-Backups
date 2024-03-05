export class DataService {
  constructor({ diffCachingService }) {
    this.diffCachingService = diffCachingService;
  }

  async accounts(accessToken) {
    const diff = await this.diffCachingService.diff(accessToken);

    const accounts = diff.account.map((account) => {
      const instrument = diff.instrument.find((instrument) => instrument.id === account.instrument);

      return {
        balance: account.balance,
        currency: {
          code: instrument ? instrument.shortTitle : null,
          symbol: instrument ? instrument.symbol : null,
        },
        id: account.id,
        title: account.title,
      };
    });

    return accounts;
  }

  async user(accessToken) {
    const diff = await this.diffCachingService.diff(accessToken);

    const user = diff.user[0];

    return {
      id: user.id.toString(),
      username: user.login,
    };
  }
}
