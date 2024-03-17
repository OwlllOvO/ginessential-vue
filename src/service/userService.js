import request from '@/utils/request';

// user register

const register = ({ name, telephone, password }) => {
  return request.post('auth/register', { name, telephone, password });
};

// user Login

const login = ({ telephone, password }) => {
  return request.post('auth/login', { telephone, password });
};

// get user info

const info = () => {
  return request.get('auth/info');
};

export default {
  register,
  login,
  info,
};
