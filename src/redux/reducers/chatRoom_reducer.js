import { SET_CURRENT_ROOM } from '../actions/type';

const initialState = {
  currentChatRoom: null,
};

export default function chatRoom(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };
    default:
      return state;
  }
}
