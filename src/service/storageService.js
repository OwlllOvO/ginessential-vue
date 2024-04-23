// local cache service

const PREFIX = 'ginessential';

// User module

const USER_PREFIX = `${PREFIX}user_`;
const USER_TOKEN = `${USER_PREFIX}token`;
const USER_INFO = `${USER_PREFIX}info`;
const USER_ID = 'user_id';

// store

const set = (key, data) => {
  localStorage.setItem(key, data);
};

// read

const get = (key) => localStorage.getItem(key);

export default {
  set,
  get,
  USER_TOKEN,
  USER_INFO,
  USER_ID,
};
