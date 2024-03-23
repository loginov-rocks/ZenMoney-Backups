import { Api } from './Api.mjs';

import { API_BASE_URL } from '../../Constants';

const api = new Api({
  baseUrl: API_BASE_URL,
});

export default api;
