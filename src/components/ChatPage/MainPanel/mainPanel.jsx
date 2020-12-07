import React, { Component } from 'react';
import MessageForm from './messageForm';
import MessageHeader from './messageHeader';
import firebase from '../../../firebase';
import {connect} from 'react-redux';
import Message from './message';


class MainPanel extends Component {
    state = {
        messages:[],
        messagesRef :firebase.database().ref('messages'),
        messagesLoading: true
    }

    componentDidMount() {
        const { chatRoom } = this.props;

        if(chatRoom) {
            this.addMessagesListener(chatRoom.id);
        }   
     
    };
    
    addMessagesListener = (chatRoomId) => {
        let messageArray = [];
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messageArray.push(DataSnapshot.val());
            this.setState({ 
                messages: messageArray,
                messagesLoading: false });
            
        });
        console.log(messageArray);
        
    };

    renderMessage = (messages) => 
        messages.length > 0 &&
        messages.map(message => (
            
            <Message
            key={message.timestamp}
            message={message}
            user={this.props.user}
            />
           
        ))
       
    ;

    render() {
        const { messages } = this.state;

        return (
            <section className="mainPanel">
                <MessageHeader />
                <div className="messages">
                    {this.renderMessage(messages)}
                </div>
                <MessageForm />
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        user:state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
};

export default connect(mapStateToProps)(MainPanel);