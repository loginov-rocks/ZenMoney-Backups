import { Api } from './Api';

import userPoolService from '../UserPool';

import { API_BASE_URL, API_AUTH_DATA_STORAGE_KEY } from '../../Constants';

const api = new Api({
  authDataStorageKey: API_AUTH_DATA_STORAGE_KEY,
  baseUrl: API_BASE_URL,
  userPoolService,
});

export default api;
