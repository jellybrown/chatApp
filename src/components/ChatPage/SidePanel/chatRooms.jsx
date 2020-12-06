import React, { Component } from 'react';
import {connect} from 'react-redux';
import './sideStyles.css';
import{ HiOutlineChevronDown, HiPlus } from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import firebase from '../../../firebase';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';

class ChatRooms extends Component {

    
    state = {
        show: false,
        name:"",
        description:"",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: ""
    };

    componentDidMount() {
        this.AddChatRoomsListeners();
    };

    componentWillUnmount() {
        this.state.chatRooms.off()
    }

    setFirstChatRoom = () => {
        const firstRoom = this.state.chatRooms[0];
        if(this.state.firstLoad && this.state.chatRooms.length > 0) {
        this.props.dispatch(setCurrentChatRoom(firstRoom));
        this.setState({ activeChatRoomId: firstRoom.id });
        }
        this.setState({ firstLoad: false })
    }

    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray }, () => this.setFirstChatRoom());
        })
    };


    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    handleSubmit = (e) => {
        e.preventDefault();
        const {name, description } = this.state;
        if (this.isFormValid(name, description)) {
            this.addChatRoom();
        }
    };

    addChatRoom = async () => {
        const key = this.state.chatRoomsRef.push().key;
        const {name, description } = this.state;
        const { user } = this.props;
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        };

        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom);
            this.setState({
                name: '',
                description: '',
                show:false
            })
        } catch(error) {
            alert(error);
        };

        
    }


    isFormValid = (name, description) => 
        name && description
    ;

    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.setState({ activeChatRoomId: room.id })
    }

    render() {
        return (
            <>
            <div className="sideChat">
                <div className="title">
                <HiOutlineChevronDown size="1.2rem"/>
                <span>Chat Rooms</span>
                </div>
               <HiPlus 
               onClick={this.handleShow} 
               size="1.2rem" 
               className="plusIcon"/>
            </div>
            <ul className="chatList">
            {this.state.chatRooms.length>0 && this.state.chatRooms.map(item => 
                <li 
                key={item.id} 
                style={{ backgroundColor: item.id === this.state.activeChatRoomId && 'rgba(255,255,255,0.2'}}
                onClick={() => this.changeChatRoom(item)}>
                    {item.name}
                </li>
            )}
            </ul>


            <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>방 만들기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>방 이름</Form.Label>
                    <Form.Control 
                    onChange={(e) => this.setState({ name: e.target.value}) }
                    type="text" 
                    placeholder="생성할 방 이름을 입력해주세요." />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginBottom: '3rem' }}>
                    <Form.Label>방 설명</Form.Label>
                    <Form.Control 
                    onChange={(e) => this.setState({ description: e.target.value}) }
                    type="text" 
                    placeholder="소개될 방 설명을 입력해주세요." />
                </Form.Group>
                
                
                </Form>

            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
                닫기
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
                생성
            </Button>
            </Modal.Footer>
             </Modal>
        </>

            
        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(ChatRooms) ;