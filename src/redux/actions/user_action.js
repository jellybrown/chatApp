import { SAVE_USER, SIGN_OUT } from './type';

export const saveUser = (user) => {
  return {
    type: SAVE_USER,
    payload: user,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};
