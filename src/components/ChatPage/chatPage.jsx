import React from 'react';
import MainPanel from './MainPanel/mainPanel';
import SidePanel from './SidePanel/sidePanel';
import './chatPage.css';

const ChatPage = (props) => {
    return (
        <section className="chatPage">
            <div className="side">
                <SidePanel/>
            </div>
            <div className="main">
                <MainPanel/>
            </div>
        </section>
    )
};

export default ChatPage;