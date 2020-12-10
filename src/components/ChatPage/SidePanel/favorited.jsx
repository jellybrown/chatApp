import React, { Component } from 'react';
import './sideStyles.css';
import firebase from '../../../firebase';
import {connect} from 'react-redux';

class Favorited extends Component {
    state = {
        favoritedChatRoom: [],
        userRef: firebase.database().ref("users")
    };

    componentDidMount() {
        if(this.props.user) {
        this.addListener(this.props.user.uid);
        }
    };

    addListener = (userId) => {
        const {userRef} = this.state;

        userRef
        .child(userId)
        .child("favorited")
        .on("child_added", DataSnapshot => {
            const favoritedChatRoom = {id: DataSnapshot.key, ...DataSnapshot.val()};
            this.setState({
                favoritedChatRoom: [...this.state.favoritedChatRoom, favoritedChatRoom]
            })
        });

        userRef
        .child(userId)
        .child("favorited")
        .on("child_removed", DataSnapshot => {
            const chatRoomToRemove = {id: DataSnapshot.key, ...DataSnapshot.val()};
            const filteredChatRooms = this.state.favoritedChatRoom.filter(chatRoom => {
                return chatRoom.id !== chatRoomToRemove.id;
            })
            this.setState({favoritedChatRoom: filteredChatRooms})
        });
    };

    render() {
        
        return (
            <div>
                favorited
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect (mapStateToProps)(Favorited);