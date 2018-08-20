import React, { Component } from 'react';
import {Form, Button} from 'semantic-ui-react';

class LoginWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false
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

    render() {
        return (
            <div>
                <Form>
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
            </div>
        );
    }
}

export default LoginWindow;