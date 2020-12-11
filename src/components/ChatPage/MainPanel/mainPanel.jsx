import React, { Component } from 'react';
import MessageForm from './messageForm';
import MessageHeader from './messageHeader';
import firebase from '../../../firebase';
import {connect} from 'react-redux';
import Message from './message';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';


class MainPanel extends Component {
    state = {
        messages:[],
        messagesRef :firebase.database().ref('messages'),
        messagesLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false

    };

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
        this.userPostCount(messageArray);
        
    };
    userPostCount = (messages) => {
        let userPosts = messages.reduce((acc, message) => {
            if(message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    image: message.user.image,
                    count: 1
                }
            }
            return acc;
        }, {});
        this.props.dispatch(setUserPosts(userPosts));
    }

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
            
    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if(
                (message.content && message.content.match(regex)) ||
                 message.user.name.match(regex)
             ) {
                 acc.push(message);
             }
             return acc;
        }, []);
        this.setState({
            searchResults
        })
    };

    handleSearchChange = (e) => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true
        },
        () => this.handleSearchMessages()
        )
         
    };

    render() {
        const { messages, searchTerm, searchResults } = this.state;

        return (
            <section className="mainPanel">
                <MessageHeader handleSearchChange={this.handleSearchChange}/>
                <div className="messages">
                    {searchTerm ? this.renderMessage(searchResults) : this.renderMessage(messages)}
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