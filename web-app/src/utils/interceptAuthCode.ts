interface AuthCode {
  authCode: string;
  type: 'userPool' | 'zenMoney';
};

export const interceptAuthCode = (): AuthCode | null => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const authCode = urlSearchParams.get('code');
  const zenMoneyUserId = urlSearchParams.get('user_id');

  if (authCode) {
    return {
      authCode,
      type: zenMoneyUserId ? 'zenMoney' : 'userPool',
    };
  }

  return null;
};
