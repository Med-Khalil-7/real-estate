import jwt from 'jsonwebtoken';

/**
 * @TODO: WARNING localstorage is not safe use HttpOnly cookie instead
 */

const TokenService = (function tokenService() {
  let service;
  function getServiceFunc() {
    if (!service) {
      service = this;
      return service;
    }
    return service;
  }
  
  const setToken = async  (tokenObj) => {
    if (tokenObj.access) {
      await localStorage.setItem('accessToken', tokenObj.access);
    }
    if (tokenObj.refresh) {
      await localStorage.setItem('refreshToken', tokenObj.refresh);
    }
  };

  const getAccessToken = () => localStorage.getItem('accessToken');

  const getRefreshToken = () => localStorage.getItem('refreshToken');

  const getTokenValidity = (tokenObj) => {
    const decodedToken = jwt.decode(tokenObj, { complete: true });
    const dateNow = new Date();
    const timeStamp = dateNow.getTime() / 1000;

    if (decodedToken.payload.exp < timeStamp) {
      return false;
    }
    return true;
  };

  const getUserPermissions = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      const { payload } = jwt.decode(accessToken, { complete: true });
      return {
        permissions: payload['permissions'],
        is_superuser: payload['is_superuser'],
        is_landlord: payload['is_landlord'],
        is_tenant: payload['is_tenant'],
        is_employee: payload['is_employee'],
      };
    }
    return {
      permissions: [],
      is_superuser: null,
      is_landlord: null,
      is_tenant: null,
      is_employee: null,
    };
  };

  const getAccessTokenValidity = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return getTokenValidity(accessToken);
    }
    return false;
  };
  const getRefreshTokenValidity = () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      return getTokenValidity(refreshToken);
    }
    return null;
  };

  const clearToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const getLocked = () => localStorage.getItem('locked');
  const setLocked = (locked) => {
    if(locked)
      localStorage.setItem('locked', true);
    else
    localStorage.setItem('locked', false);
  }


  return {
    getService: getServiceFunc,
    setToken,
    getAccessToken,
    getRefreshToken,
    getAccessTokenValidity,
    getRefreshTokenValidity,
    clearToken,
    getUserPermissions,
    getLocked,
    setLocked
  };
})();

export default TokenService;
