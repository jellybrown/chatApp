import React, { useRef } from 'react';
import { BsChatFill } from 'react-icons/bs';
import  Dropdown  from 'react-bootstrap/Dropdown';
import  Image  from 'react-bootstrap/Image';
import './sideStyles.css';
import { useSelector, useDispatch } from 'react-redux';
import firebase from '../../../firebase';
import { changeImage, signOut } from '../../../redux/actions/user_action';
import {useHistory} from 'react-router-dom';
import mime from 'mime-types';

const UserPanel = () => {

    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const history = useHistory();
    const fileRef = useRef();

    const onLogout = () => {
        firebase.auth().signOut();
        dispatch(signOut());
        if(!user) history.push("/login");
    }

    const onChangeImage = () => {
        fileRef.current.click();
    }

    const onUploadImage = async (e) => {
        const file = e.target.files[0];
        const metadata = { contentType: mime.lookup(file.name)};

        try {
            let uploadTaskSnapshot= await firebase.storage().ref()
            .child(`user_image/${user.uid}`)
            .put(file, metadata);

            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

            await firebase.auth().currentUser.updateProfile({
                photoURL: downloadURL
            });
            dispatch(changeImage(downloadURL));

            await firebase.database().ref('users')
            .child(user.uid)
            .update({ image: downloadURL })
        }catch(error) {
            alert(error)
        }

       // f
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
                    <input className="fileInput" 
                    type="file" 
                    accept="image/jpeg, image/png"
                    ref={fileRef}
                    onChange={onUploadImage}/>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={onChangeImage}>프로필 사진 변경</Dropdown.Item>
                    <Dropdown.Item onClick={() => onLogout()}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
              </Dropdown>
            </div>
        </div>
    );
};

export default UserPanel;