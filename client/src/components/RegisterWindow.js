import React, { Component } from 'react';
import {Form, Popup, Button, Message} from 'semantic-ui-react';
import axios from 'axios';

class RegisterWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            loading: false,
            usernameErr: false,
            passwordErr: false,
            errMsg: false
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

    registerUser = () => {
        var errors = []
        errors[0] = this.state.username.length ? false : true;
        errors[1] = this.state.password.length ? false : true;
        this.setState({usernameErr : errors[0], passwordErr : errors[1]})
        if (!errors[0] && !errors[1]) {
            this.setState({loading: true, errMsg: false});
            axios.post('/register', {
                username: this.state.username,
                password: this.state.password
            })
            .then((res) => {
                this.props.callback(this.state.username);
            })
            .catch((err) => {
                console.log(err.response);
                this.setState({loading: false, errMsg: true});
            })
        }
    }

    handleDismiss = (event, data) => {
        this.setState({errMsg: false})
    }


    render() {
        return (
            <div>
                <Form loading={this.state.loading} onSubmit={this.registerUser} error={this.state.errMsg}>
                    <Popup
                        trigger={
                            <Form.Input 
                                fluid label="Username" 
                                value={this.state.username}
                                onChange={this.handleChange}
                                name="username"
                                placeholder="Enter Username"
                                icon='users'
                                iconPosition='left'
                                error={this.state.usernameErr}
                        />}
                        header='Requirements'
                        content='There are no requirements'
                        on='focus'
                        position='right center'
                    />
                    <Popup
                        trigger={
                            <Form.Input
                                fluid label="Password"
                                type = {this.state.showPassword ? '' : 'password'}
                                onChange={this.handleChange}
                                name='password'
                                value={this.state.password}
                                placeholder="Enter Password"
                                icon='lock'
                                iconPosition='left'
                                error={this.state.passwordErr}
                        />}
                        header='Requirements'
                        content='Also no requirements'
                        on='focus'
                        position='right center'
                    />
                    <Form.Checkbox
                        name="showPassword"
                        label='Show Password'
                        onChange={this.handleChecked}
                    />
                    <Button
                        content='Register'
                        type='submit'
                        color='instagram'
                        fluid
                    />
                    <Message
                        error
                        header='Username Taken'
                        content='That username is already in use, please select another one.'
                        onDismiss={this.handleDismiss}
                    />
                </Form>
            </div>
        );
    }
}

export default RegisterWindow;