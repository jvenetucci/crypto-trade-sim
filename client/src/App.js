import React, { Component } from 'react';
import './App.css';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';
import Login from './components/pages/Login'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: null
		}
	}

	handleChange = (event) => {
		event.preventDefault();
		this.setState({
			userName: 'Bob'
		});
	}
	

	render() {
		const loggedIn = this.state.userName;
		if (loggedIn) {
			return <div>User is {loggedIn}</div>
		} else {
			// return <Button color='yellow' onClick={this.handleChange}>Log In</Button>
			return <Route exact to='/' component={Login} />
		}
	}
}

export default App;