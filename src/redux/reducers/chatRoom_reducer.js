import {
  SET_CURRENT_ROOM,
  SET_PRIVATE_ROOM,
  SET_USER_POSTS,
} from '../actions/type';

const initialState = {
  currentChatRoom: null,
  isPrivateRoom: false,
};

export default function chatRoom(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };
    case SET_PRIVATE_ROOM:
      return {
        ...state,
        isPrivateRoom: action.payload,
      };
    case SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };
    default:
      return state;
  }
}
