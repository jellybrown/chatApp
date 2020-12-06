import React from 'react';
import Media from 'react-bootstrap/Media';
import moment from 'moment';


const Message = ({message, user}) => {

    const timeFromNow = timestamp => {
        moment(timestamp).fromNow();
    }
    
    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }

    return (
        <Media>
          <img
            width={48}
            height={48}
            className="mr-3"
            src={message.user.image}
            alt={message.user.name}
          />
          <Media.Body>
            <h6>{message.user.name}
            <span>{timeFromNow(message.timestamp)}</span>
            </h6>
            {isImage(message) ?
            <img style={{ maxWidth: '300px'}} alt="이미지" src={message.image} />    
            :   
            <p>{message.content}</p>
            }   
          </Media.Body>
        </Media>
    );
};

export default Message;