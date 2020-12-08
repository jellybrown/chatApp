import React from 'react';
import Container  from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { AiOutlineSearch } from 'react-icons/ai';
import './mainStyles.css';


const MessageHeader = () => {
    return (
        <div className="messageHeader">
        <Container 
                style={{ 
                height: '10em',
                padding: '1em 2em 0 2em'
                }}>
        <Row style={{marginBottom: '1em' }}>
            <Col sm={8} style={{ fontSize: '2rem'}}>방 제목</Col>
            <Col sm={4} style={{ display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                <InputGroup.Prepend style={{
                    alignSelf: 'stretch',
                    margin: '0.3em 0'}}>
                <InputGroup.Text id="basic-addon1"> 
                <AiOutlineSearch />
                </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                />
            </Col>
        </Row>
        <Row>
            <Col sm>
            <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
            </Card>
            </Accordion>
            </Col>
            <Col sm>
            <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
            </Card>
            </Accordion>
            </Col>
            <Col sm style={{paddingTop: '0.5rem'}}>
            방장
            </Col>
        </Row>
        </Container>
        </div>
    );
};

export default MessageHeader;
