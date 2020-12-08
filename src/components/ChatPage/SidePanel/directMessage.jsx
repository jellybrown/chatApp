import React, { Component } from 'react';
import {HiOutlineChevronDown} from 'react-icons/hi';
import './sideStyles.css';



class DirectMessage extends Component {
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

export default DirectMessage;