import React, { Component } from 'react';
import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './components/pages/Login'
import NoPageFound from './components/pages/NoPageFound'

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

	userLoggedIn = (username) => {
		console.log("LOGGEED INN");
		this.setState({username: username})
	}
	
	render() {
		const loggedIn = this.state.userName;
		return (
			<div>
				<Switch>
					<Route exact path='/' render={() => (<Redirect to="/login"/>)}/>
					<Route path='/login' component={Login} />
					<Route component={NoPageFound} />
				</Switch>
			</div>
		)
		// if (loggedIn) {
		// 	return <div>User is {loggedIn}</div>
		// } else {
		// 	// return <Button color='yellow' onClick={this.handleChange}>Log In</Button>
		// 	return <Route 
		// 		to='/login'
		// 		render={() => <Login callback={this.userLoggedIn} />}
		// 	/>
		// }
	}
}

export default App;