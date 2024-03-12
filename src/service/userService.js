import request from '@/utils/request';

// user register

const register = ({ name, telephone, password }) => {
  return request.post('auth/register', { name, telephone, password });
};

// get user info

const info = () => {
  return request.get('auth/info');
};

export default {
  register,
  info,
};
