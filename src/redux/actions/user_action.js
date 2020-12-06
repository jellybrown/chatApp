import { CHANGE_IMAGE, SAVE_USER, SIGN_OUT } from './type';

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

export const changeImage = (photoURL) => {
  return {
    type: CHANGE_IMAGE,
    payload: photoURL,
  };
};
