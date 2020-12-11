import React, { Component } from 'react';
import './sideStyles.css';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import {HiOutlineChevronDown} from 'react-icons/hi';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

class Favorited extends Component {
    state = {
        favoritedChatRoom: [],
        userRef: firebase.database().ref("users"),
        activeChaRoomId: ''
    };

    componentDidMount() {
        if(this.props.user) {
        this.addListener(this.props.user.uid);
        }
    };

    componentWillUnmount() {
        if(this.props.user) {
            this.removeListener(this.props.user.uid);
        }
    };

    removeListener = (userId) => {
        this.state.userRef.child(`${userId}/favorited`).off();
    }

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


    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({ activeChatRoomId: room.id });
     
    };

    renderFavorited = (favoritedChatRoom) => (
        favoritedChatRoom.length > 0 && favoritedChatRoom.map(favorited => 
            (<li 
            key={favorited.id}
            onClick={() => this.changeChatRoom(favorited)}
            style={{backgroundColor: this.state.activeChatRoomId === favorited.id && 'rgba(255,255,255,0.2)'}}
            >
                {favorited.name}
            </li>)
            )
        );

    render() {
        const { favoritedChatRoom } = this.state;
        return (
            
            <div className="sideFavorited">
                <div className="title">
                    <HiOutlineChevronDown size="1.2rem"/>
                    <span>Favorite Rooms</span>
                </div>
                <ul className="favoriteList">
                    {this.renderFavorited(favoritedChatRoom)}
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

export default connect (mapStateToProps)(Favorited);