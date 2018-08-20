import React, { Component } from 'react';
import './App.css';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';
import Login from './components/pages/Login'
// import { Button } from 'semantic-ui-react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'


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

// const Home = () => (
// 	<div>
// 	  <h2>Home</h2>
// 	</div>
//   )
  
//   const About = () => (
// 	<div>
// 	  <h2>About</h2>
// 	</div>
//   )
  
//   const Topic = ({ match }) => (
// 	<div>
// 	  <h3>{match.params.topicId}</h3>
// 	</div>
//   )
  
//   const Topics = ({ match }) => (
// 	<div>
// 	  <h2>Topics</h2>
// 	  <ul>
// 		<li>
// 		  <Link to={`${match.url}/rendering`}>
// 			Rendering with React
// 		  </Link>
// 		</li>
// 		<li>
// 		  <Link to={`${match.url}/components`}>
// 			Components
// 		  </Link>
// 		</li>
// 		<li>
// 		  <Link to={`${match.url}/props-v-state`}>
// 			Props v. State
// 		  </Link>
// 		</li>
// 	  </ul>
  
// 	  <Route path={`${match.path}/:topicId`} component={Topic}/>
// 	  <Route exact path={match.path} render={() => (
// 		<h3>Please select a topic.</h3>
// 	  )}/>
// 	</div>
//   )
  
//   const BasicExample = () => (
// 	<Router>
// 	  <div>
// 		<ul>
// 		  <li><Link to="/">Home</Link></li>
// 		  <li><Link to="/about">About</Link></li>
// 		  <li><Link to="/topics">Topics</Link></li>
// 		</ul>
  
// 		<hr/>
  
// 		<Route exact path="/" component={Home}/>
// 		<Route path="/about" component={About}/>
// 		<Route path="/topics" component={Topics}/>
// 	  </div>
// 	</Router>
//   )
//   export default BasicExample

// const App = () => (
// 	<div>
// 		<nav>
// 			<Link to="/login">Login</Link>
// 		</nav>
// 		<div>
// 			<Route path="/login" component={Login} />
// 		</div>
// 	</div>
// )
// class App extends Component {
// 	render() {
//     	return (
// 		<div>
// 			<div>
// 				<Link to="/login">Login</Link>
// 			</div>
// 			<div>
// 				<Route path="/" component={Login} />
// 			</div>
// 		</div>
//     	);
//   	}
// }

export default App;