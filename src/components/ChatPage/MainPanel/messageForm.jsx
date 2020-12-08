import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './mainStyles.css';
import { useState } from 'react';
import firebase from '../../../firebase';
import {useSelector} from 'react-redux';
import mime from 'mime-types';

const MessageForm = () => {
    const [text, setText] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    const user = useSelector(state => state.user.currentUser);
    const imageRef = useRef();
    const storageRef = firebase.storage().ref();

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
        return message;
    }

    const messageRef = firebase.database().ref('messages');
    const sendMessage = async () => {
        if(!text) {
            setErrors(prev => prev.concat("Type contents first"));
            return;
        } else {
            setLoading(true);
            try {
                await messageRef.child(chatRoom.id).push().set(createMessage());
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

    const onSelectImageRef = () => {
        imageRef.current.click();
    }

    const onUploadImage = (e) => {
        const file = e.target.files[0];
        const filePath = `/message/public/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name)};
        setLoading(true);

        try {
            let uploadTask = storageRef.child(filePath).put(file, metadata);
            uploadTask.on("state_changed", 
            UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                );
                setPercentage(percentage);
                console.log(percentage);

            },
            err => { 
                console.error(err);
                setLoading(false);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => {
                    messageRef.child(chatRoom.id).push().set(createMessage(downloadURL));
                    setLoading(false)
                });
            }
            )
        } catch(error) {
            alert(error);
        }

    }


    return (
        <>
            <Form style={{width: '100%'}} onSubmit={sendMessage}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows={3} value={text} onChange={onChange}/>
                 </Form.Group>
            </Form>
            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar now={percentage} label={`${percentage}%`} />
            }
           

            <div> { errors.map(msg => <p key={msg}>{msg}</p>) }</div>
            <Row>
                <Col style={{display:'flex', justifyContent:'center', padding: 0}}>
                    <button className="formBtn send" onClick={sendMessage}>SEND</button>
                </Col>
                <Col style={{display:'flex', justifyContent:'center', padding: 0}}>
                    <button 
                    className="formBtn upload"
                    onClick={onSelectImageRef}
                    
                    >UPLOAD</button>
                </Col>
            </Row>
            <input 
            style={{display: 'none'}}
            ref={imageRef}
            onChange={onUploadImage}
            type="file"/>
        </>
    );
};

export default MessageForm;


