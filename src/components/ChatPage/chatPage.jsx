import React from 'react';
import MainPanel from './MainPanel/mainPanel';
import SidePanel from './SidePanel/sidePanel';
import './chatPage.css';
import { useSelector } from 'react-redux';

const ChatPage = (props) => {
    const currentUser = useSelector(state => state.user.currentUser);
    const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    console.log(currentChatRoom);
    return (
        <section className="chatPage">
            <div className="side">
                <SidePanel
                    key={currentUser && currentUser.uid}
                />
            </div>
            <div className="main" >
                <MainPanel
                key={currentChatRoom && currentChatRoom.id} 
                />
            </div>
        </section>
    )
};

export default ChatPage;