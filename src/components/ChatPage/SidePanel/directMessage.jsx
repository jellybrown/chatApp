import React, { Component } from 'react';
import {HiOutlineChevronDown} from 'react-icons/hi';
import { connect } from 'react-redux';
import './sideStyles.css';
import firebase from '../../../firebase';
import {FaRegEnvelope} from 'react-icons/fa';

class DirectMessage extends Component {

    state = {
        userRef: firebase.database().ref("users"),
        users: []
    }

    componentDidMount() {
        if(this.props.user) {
        this.addUserListners(this.props.user.uid);
        }   
        
    };

    addUserListners = (currentUserId) => {
        const { userRef } =  this.state;
        
        let usersArray = [];
       userRef.on("child_added", DataSnapshot => {
            if(currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user);
                this.setState({ users: usersArray });
            }
        })
    };

    getChatRoomId = (userId) => {
        const currentUserId = this.props.user.uid;
        return userId > currentUserId ?
            `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    };

    chageChatRoom = (userId) => {
        const ChatRoomId = this.getChatRoomId(userId);
    };

    renderDirectMessages = (users) => 
        users.length > 0 &&
        users.map(user => (
            <li 
            key={user.uid}
            className="dmUser"
            onClick={() => this.chageChatRoom(user.uid)}
            >
                <FaRegEnvelope />
                <span>{user.name}</span>
            </li>
        ))
        
    

    render() {
        const { users } = this.state;
        return (
            
            <div className="dmChat">
                    <div className="title">
                        <HiOutlineChevronDown size="1.2rem"/>
                        <span>Direct Messages (1) </span>
                    </div>
                
                <ul className="dmList">
                    {this.renderDirectMessages(users)}
                </ul>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessage);