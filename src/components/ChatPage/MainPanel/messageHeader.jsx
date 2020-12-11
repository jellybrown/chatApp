import React, { useEffect, useState } from 'react';
import Container  from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import { AiOutlineSearch } from 'react-icons/ai';
import './mainStyles.css';
import { useSelector } from 'react-redux';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import firebase from '../../../firebase';

const MessageHeader = ({handleSearchChange}) => {

    const [isFavorited, setFavorited] = useState(false);
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    const user = useSelector(state => state.user.currentUser);
    const isPravateRoom = useSelector(state => state.chatRoom.isPravateRoom);
    const userPosts = useSelector(state => state.chatRoom.userPosts);
    const userRef = firebase.database().ref("users");
    
    useEffect(() => {
        if(chatRoom && user) {
        addFavoriteListener(chatRoom.id, user.uid);
    }
    }, []);

    const addFavoriteListener = (chatRoomId, userId) => {
        userRef
        .child(userId)
        .child("favorited")
        .once("value")
        .then(data => {
            if(data.val() !== null) {
                const chatRoomIds = Object.keys(data.val());
                const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
                setFavorited(isAlreadyFavorited);
            }
        })
    };

    const handleFavorite = () => {
        
        if(isFavorited) {
            userRef.child(`${user.uid}/favorited`)
            .child(chatRoom.id)
            .remove(err => {
                console.log(err);
            });
            setFavorited(isFavorited => !isFavorited);
        } else {
            userRef.child(`${user.uid}/favorited`).update({
                [chatRoom.id] : {
                    name: chatRoom.name,
                    description: chatRoom.description,
                    createdBy: {
                        name: chatRoom.createdBy.name,
                        image: chatRoom.createdBy.image
                    }
                }
            });
            setFavorited(isFavorited => !isFavorited);
       }
    }
    const renderUserPosts = (userPosts) => 
        
            Object.entries(userPosts)
            .sort((a,b) => b[1].count - a[1].count)
            .map(([key,val], i) => (
                <li key={isFavorited}
                style={{listStyle: 'none', padding: '0.5em 0'}}>
                    <Media>
                    <img 
                        width={40}
                        height={40}
                        className="mr-3"
                        src={val.image}
                        alt={val.name}
                    />
                    <Media.Body style={{ fontSize: '0.8rem'}}>
                        <h6>{key}</h6>
                        <span>
                            {val.count}개
                        </span>
                    </Media.Body>
                    </Media>
                </li>
            ))
        
            
    return (
        <div className="messageHeader">
        <Container 
                style={{ 
                height: '10em',
                padding: '1em 2em 0 2em'
                }}>
        <Row style={{marginBottom: '1em' }}>
            <Col sm={8} style={{ fontSize: '2rem'}}>
                {chatRoom && chatRoom.name}
               
                {!isPravateRoom && 
                <span onClick={handleFavorite} style={{cursor:'pointer', marginLeft: '1.1em'}}>
                    {!isFavorited ? <AiOutlineStar /> : <AiFillStar />}
                </span>
                }
                
            </Col>
            <Col sm={4} style={{ display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                <InputGroup.Prepend style={{
                    alignSelf: 'stretch',
                    margin: '0.3em 0'}}>
                <InputGroup.Text id="basic-addon1"> 
                <AiOutlineSearch />
                </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                onChange={handleSearchChange}
                placeholder="search"
                aria-label="search"
                aria-describedby="basic-addon1"
                />
            </Col>
        </Row>
        <Row>
            <Col sm>
            <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                Description
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                </Accordion.Collapse>
            </Card>
            </Accordion>
            </Col>
            <Col sm>
            <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                User Message
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <ul
                        style={{padding: '0'}}
                    >{userPosts && renderUserPosts(userPosts)}</ul>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
            </Accordion>
            </Col>
            {!isPravateRoom &&
                <Col sm style={{paddingTop: '0.5rem'}}>
                <Image src={chatRoom && chatRoom.createdBy.image} 
                roundedCircle style={{width: '30px', height:'30px'}}/>
                <span>{chatRoom && chatRoom.createdBy.name}</span>
                 </Col>
            }
            
        </Row>
        </Container>
        </div>
    );
};

export default MessageHeader;
