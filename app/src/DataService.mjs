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

  async transactions(accessToken) {
    const diff = await this.diffCachingService.diff(accessToken);

    const transactions = diff.transaction.map((transaction) => {
      const incomeAccount = diff.account.find((account) => account.id === transaction.incomeAccount);
      const outcomeAccount = diff.account.find((account) => account.id === transaction.outcomeAccount);

      const incomeInstrument = diff.instrument.find((instrument) => instrument.id === transaction.incomeInstrument);
      const outcomeInstrument = diff.instrument.find((instrument) => instrument.id === transaction.outcomeInstrument);

      return {
        id: transaction.id,
        date: transaction.date,
        //
        incomeAccount: {
          id: transaction.incomeAccount,
          title: incomeAccount ? incomeAccount.title : null,
        },
        incomeAmount: transaction.income,
        incomeCurrency: {
          code: incomeInstrument ? incomeInstrument.shortTitle : null,
          symbol: incomeInstrument ? incomeInstrument.symbol : null,
        },
        //
        outcomeAccount: {
          id: transaction.outcomeAccount,
          title: outcomeAccount ? outcomeAccount.title : null,
        },
        outcomeAmount: transaction.outcome,
        outcomeCurrency: {
          code: outcomeInstrument ? outcomeInstrument.shortTitle : null,
          symbol: outcomeInstrument ? outcomeInstrument.symbol : null,
        },
        //
        categories: transaction.tag.map((tagId) => {
          const tag = diff.tag.find((tag) => tag.id === tagId);

          return {
            id: tagId,
            title: tag ? tag.title : null,
          };
        }),
        //
        payee: transaction.payee || null,
        comment: transaction.comment || null,
      };
    });

    return transactions;
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
