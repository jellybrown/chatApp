import React from 'react';
import { BsChatFill } from 'react-icons/bs';
import  Dropdown  from 'react-bootstrap/Dropdown';
import  Image  from 'react-bootstrap/Image';
import './sideStyles.css';
import { useSelector, useDispatch } from 'react-redux';
import firebase from '../../../firebase';
import { signOut } from '../../../redux/actions/user_action';
import {useHistory} from 'react-router-dom';

const UserPanel = () => {

    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const history = useHistory();
    const onClick = () => {
        firebase.auth().signOut();
        dispatch(signOut());
        if(!user) history.push("/login");
    }

    return (
        <div>
            <div className="appInfo">
                <BsChatFill size='2.5rem' style={{ color: 'white'}}/>
                <h1 className="appTitle">Simple Talk</h1>
            </div>
            <div className="userInfo">
                 <Image src={user && user.photoURL} className="profileImg" roundedCircle />
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {user && user.displayName}
                    </Dropdown.Toggle>
                
                    <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">프로필 사진 변경</Dropdown.Item>
                    <Dropdown.Item onClick={() => onClick()}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
              </Dropdown>
            </div>
        </div>
    );
};

export default UserPanel;