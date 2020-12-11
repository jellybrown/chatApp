import { SET_CURRENT_ROOM, SET_PRIVATE_ROOM, SET_USER_POSTS } from './type';

export const setCurrentChatRoom = (room) => {
  return {
    type: SET_CURRENT_ROOM,
    payload: room,
  };
};

export const setPrivateChatRoom = (isPrivateRoom) => {
  return {
    type: SET_PRIVATE_ROOM,
    payload: isPrivateRoom,
  };
};

export const setUserPosts = (userPosts) => {
  return {
    type: SET_USER_POSTS,
    payload: userPosts,
  };
};
