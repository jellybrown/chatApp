import React from 'react';
import Media from 'react-bootstrap/Media';
import moment from 'moment';


const Message = ({message, user}) => {

    const timeFromNow = timestamp => {
      return  moment(timestamp).fromNow();
    }
    
    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }

    const isMessageMine = (message, user) => {
      if(user) {
      return message.user.id === user.uid
      }
    }

    return (
      <div >
        <Media className="messageList"
        style={{background: isMessageMine(message,user) && '#ddd'}}>
          <img
            width={44}
            height={44}
            className="mr-3"
            src={message.user.image}
            alt={message.user.name}
          />
          <Media.Body className="message">
            <h6>
              <span className="author">{message.user.name}</span>
              <span className="time">
              {timeFromNow(message.timestamp)}
              </span>
            </h6>
            {isImage(message) ?
            <img style={{ maxWidth: '300px'}} alt="이미지" src={message.image} />    
            :   
            <span className="content">{message.content}</span>
            }   
          </Media.Body>
        </Media>
        </div>
    );
};

export default Message;