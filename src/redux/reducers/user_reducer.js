import { CHANGE_IMAGE, SAVE_USER, SIGN_OUT } from '../actions/type';

const initialState = {
  currentUser: null,
  isLoading: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    case SIGN_OUT:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    case CHANGE_IMAGE:
      return {
        ...state,
        currentUser: { ...state.currentUser, photoURL: action.payload },
        isLoading: false,
      };
    default:
      return state;
  }
}
