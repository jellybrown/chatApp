import React, { Component } from 'react';
import {HiOutlineChevronDown} from 'react-icons/hi';
import { connect } from 'react-redux';
import './sideStyles.css';
import firebase from '../../../firebase';


class DirectMessage extends Component {

    state = {
        userRef: firebase.database().ref("users"),
        users: ''
    }

    componentDidMount() {
        if(this.props.user) {
        this.addUserListners(this.props.user.uid);
        }   
        
    };

    addUserListners = (currentUserId) => {
        const { userRef } =  this.state;
        
        let usersArray = [];
       userRef.on("child_added", DataSnapshot => {
            if(currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user);
                this.setState({ users: usersArray });
            }
        })
    }

    renderDirectMessages = () => {

    }

    render() {
        return (
            
            <div className="dmChat">
                    <div className="title">
                        <HiOutlineChevronDown size="1.2rem"/>
                        <span>Direct Messages (1) </span>
                    </div>
                
                <ul className="dmList">
                    {this.renderDirectMessages()}
                </ul>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessage);