import { SET_CURRENT_ROOM } from './type';

export const setCurrentChatRoom = (room) => {
  return {
    type: SET_CURRENT_ROOM,
    payload: room,
  };
};
