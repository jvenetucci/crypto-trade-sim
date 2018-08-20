import React, { Component } from 'react';
import {Form, Button, Message} from 'semantic-ui-react';
import axios from 'axios';

class LoginWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            err: false
        }
    }

    handleChange = (e, {name, value}) => {
        // e.preventDefault();
        this.setState({
            [name]: value
        })
    }

    handleChecked = (e, {name, checked}) => {
        // e.preventDefault();
        this.setState({
            [name]: checked
        })
    }

    login = () => {
        axios.post('/login', {
            username: this.state.username,
            password: this.state.password
        })
        .then((res) => {
            this.props.callback(this.state.username);
        })
        .catch((err) => {
            console.log(err)
            this.setState({'err': true})
        })
    }

    handleDismiss = (event, data) => {
        this.setState({'err': false})
    }


    render() {
        let errMsg;
        if (this.state.err) {
            errMsg = <Message
                        error
                        header='Invalid Credentials'
                        content='Invalid username/password'
                        attached="top"
                        onDismiss={this.handleDismiss}
                    />
        } else {errMsg = null}
        return (
            <div>
                <Form onSubmit={this.login}>
                    <Form.Input 
                        fluid label="Username" 
                        value={this.state.username}
                        onChange={this.handleChange}
                        name="username"
                        placeholder="Enter Username"
                        icon='users'
                        iconPosition='left'
                    />
                    <Form.Input
                        fluid label="Password"
                        type = {this.state.showPassword ? '' : 'password'}
                        onChange={this.handleChange}
                        name='password'
                        value={this.state.password}
                        placeholder="Enter Password"
                        icon='lock'
                        iconPosition='left'
                    />
                    <Form.Checkbox
                        name="showPassword"
                        label='Show Password'
                        onChange={this.handleChecked}
                    />
                    <Button
                        content='Log In'
                        type='submit'
                        color='instagram'
                        fluid
                    />
                </Form>
                {errMsg}
            </div>
        );
    }
}

export default LoginWindow;