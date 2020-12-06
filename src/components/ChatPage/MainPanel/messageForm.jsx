import React from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './mainStyles.css';
import { useState } from 'react';
import firebase from '../../../firebase';
import {useSelector} from 'react-redux';

const MessageForm = () => {
    const [text, setText] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    const user = useSelector(state => state.user.currentUser);

    const onChange = (e) => {
        setText(e.target.value);
    }

    const createMessage = (fileUrl = null) =>  {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        };

        if(fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = text;
        }
        return message
    }

    const messageRef = firebase.database().ref('messages');
    const sendMessage = async () => {
        if(!text) {
            setErrors(prev => prev.concat("Type contents first"));
            return;
        } else {
            setLoading(true);
            try {
                await messageRef.child(chatRoom.id).push().set(createMessage())
                setLoading(false);
                setText('');
                setErrors([]);
            } catch(error) {
                setErrors(prev => prev.concat(error.message));
                setLoading(false);
                setTimeout(() => {
                    setErrors([]);
                },5000);
            }
            
        }
    }

    return (
        <>
            <Form style={{width: '100%'}} onSubmit={sendMessage}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows={3} value={text} onChange={onChange}/>
                 </Form.Group>
            </Form>

            <ProgressBar now={60} label={`${60}%`} />

            <div> { errors.map(msg => <p key={msg}>{msg}</p>)}</div>
            <Row>
                <Col style={{display:'flex', justifyContent:'center', padding: 0}}>
                <button className="formBtn send" onClick={sendMessage}>SEND</button>
                </Col>
                <Col style={{display:'flex', justifyContent:'center', padding: 0}}>
                <button className="formBtn upload">UPLOAD</button>
                </Col>
            </Row>
            </>
    );
};

export default MessageForm;


