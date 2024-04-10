import { Api } from './Api';

import { API_BASE_URL, API_AUTH_DATA_STORAGE_KEY } from '../../Constants';

const api = new Api({
  authDataStorageKey: API_AUTH_DATA_STORAGE_KEY,
  baseUrl: API_BASE_URL,
});

export default api;
