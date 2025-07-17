import axios from 'axios';

import { TOKEN_REFRESH } from './constants/api';
import TokenService from './services/TokenService';

const api = axios.create();
api.CancelToken = axios.CancelToken;
api.isCancel = axios.isCancel;
/**
 * Request interceptor
 */
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const valid = TokenService.getRefreshTokenValidity();
    // if refresh token is expired, redirect user to login with action
    if (!valid) {
      TokenService.clearToken();
    }

    if (error) {
      console.warn(error);
    }

    if (error.response.status === 401 && !originalRequest.retry && TokenService.getRefreshToken()) {
      originalRequest.retry = true;
      return api({
        url: TOKEN_REFRESH,
        method: 'post',
        data: {
          refresh: TokenService.getRefreshToken(),
        },
      }).then((res) => {
        if (res.status === 200) {
          TokenService.setToken(res.data);

          api.defaults.headers.common.Authorization = `Bearer ${TokenService.getAccessToken()}`;

          return api(originalRequest);
        }
        return null;
      });
    }
    return Promise.reject(error);
  }
);

export default api;
