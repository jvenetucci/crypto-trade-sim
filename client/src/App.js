import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import axios from 'axios';
import Dashboard from './components/pages/Dashboard';
import Login from './components/pages/Login';
import NoPageFound from './components/pages/NoPageFound';
import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: sessionStorage.getItem("username")
		}
	}

	// Use this to persist state. Check with the server and return username
	getUserName = () => {
		axios.get('/amiLoggedIn')
		.then((res) => {
			this.setState({username: res.data})
		})
	}

	userLoggedIn = (username) => {
		console.log("From App: Logged In");
		sessionStorage.setItem("username", username);
		this.setState({username: username})
	}

	render() {
		const loggedIn = this.state.username;
		return (
			<Router>
				<Switch>
					<Route exact path='/' render={() => (
						loggedIn ? (<Redirect to="/dashboard"/>) : (<Redirect to="/login"/>))}/>
					<Route path='/login' render={() => (
						loggedIn ? (<Redirect to="/dashboard"/>) : (<Login callback={this.userLoggedIn}/>))}/>
					<Route path='/dashboard' component={Dashboard} />
					<Route component={NoPageFound} />
				</Switch>
			</Router>		
		)
	}
}

export default App;