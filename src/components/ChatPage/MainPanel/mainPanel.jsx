import React, { Component } from 'react';
import MessageForm from './messageForm';
import MessageHeader from './messageHeader';
import firebase from '../../../firebase';
import {connect} from 'react-redux';
import Message from './message';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';


class MainPanel extends Component {
    messageEnd = React.createRef();

    state = {
        messages:[],
        messagesRef :firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        messagesLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false,
        typingUsers: [],
        listenerLists: []

    };
    componentDidUpdate() {
        if(this.messageEnd) {
            this.messageEnd.scrollIntoView({behavior: "smooth"});
        }
    };

    componentDidMount() {
        const { chatRoom } = this.props;

        if(chatRoom) {
            this.addMessagesListener(chatRoom.id);
            this.addTypingListener(chatRoom.id);
        }   
    };

    componentWillUnmount() {
        this.removeListeners(this.state.listenerLists)
    };
    removeListeners = (listeners) => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event)
        })
    };

    addTypingListener = (chatRoomId) => {
        let typingUsers = [];
        this.state.typingRef.child(chatRoomId).on("child_added", DataSnapshot => {
            if(DataSnapshot.key !== this.props.user.uid) {
                typingUsers = typingUsers.concat({
                    id: DataSnapshot.key,
                    name: DataSnapshot.val()
                });
                this.setState({typingUsers: typingUsers});
            }
        });
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added");

        this.state.typingRef.child(chatRoomId).on("child_removed", DataSnapshot => {
            const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
            if(index !== -1) {
                typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
                this.setState({typingUsers: typingUsers});
            };

        });
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed");

    };
    
    addToListenerLists = (id, ref, event) => {
        const index = this.state.listenerLists.findIndex(listener => {
            return (
                listener.id === id &&
                listener.ref === ref &&
                listener.event === event
            );
        })

        if(index === -1) {
            const newListener = {id, ref, event};
            this.setState({
                listenerLists: this.state.listenerLists.concat(newListener)
            });
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

    renderTypingUsers = (typingUsers) => (
        typingUsers.map(user => (
            <span>{user.name}님이 채팅을 입력하고 있습니다...</span>
        ))
    );

    render() {
        const { messages, searchTerm, searchResults, typingUsers } = this.state;

        return (
            <section className="mainPanel">
                <MessageHeader handleSearchChange={this.handleSearchChange}/>
                <div className="messages">
                    {searchTerm ? this.renderMessage(searchResults) : this.renderMessage(messages)}
                    {typingUsers.length > 0 && this.renderTypingUsers(typingUsers)}
                    <div ref={this.messageEnd}/>
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