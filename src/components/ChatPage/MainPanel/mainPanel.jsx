import React, { Component } from 'react';
import MessageForm from './messageForm';
import MessageHeader from './messageHeader';

class MainPanel extends Component {
    render() {
        return (
            <section className="mainPanel">
                <MessageHeader />
                <MessageForm />
            </section>
        );
    }
}

export default MainPanel;