import React, { Component } from 'react';
import ChatRooms from './chatRooms';
import DirectMessage from './directMessage';
import Favorited from './favorited';
import UserPanel from './userPanel';
import './sideStyles.css';

class SidePanel extends Component {
    render() {
        return (
            <div className="sidePanel">
               <UserPanel />
               <Favorited />
               <ChatRooms />
               <DirectMessage />
            </div>
        );
    }
}

export default SidePanel;