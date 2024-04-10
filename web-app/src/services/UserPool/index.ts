import { UserPool } from './UserPool';

import { USER_POOL_CLIENT_CALLBACK_URL, USER_POOL_CLIENT_ID, USER_POOL_DOMAIN } from '../../Constants';

const userPool = new UserPool({
  clientCallbackUrl: USER_POOL_CLIENT_CALLBACK_URL,
  clientId: USER_POOL_CLIENT_ID,
  domain: USER_POOL_DOMAIN,
});

export default userPool;
