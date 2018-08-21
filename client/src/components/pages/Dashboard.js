import React, { Component } from 'react'
import {Icon, Menu, Segment, Sidebar, Button } from 'semantic-ui-react'
import {NavLink, Switch} from 'react-router-dom';
import {Route , BrowserRouter} from 'react-router-dom'
import NoPageFound from './../pages/NoPageFound'
import Profile from './../pages/Profile';
import Market from './../pages/Market';
import History from './../pages/History';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false
        }
    }

    toggleBar = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    

    render() {
        const visible = this.state.visible;
        return(
        <div>
        
        <BrowserRouter>
        <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} 
          animation='push'
          icon='labeled' 
          inverted
          vertical 
          visible={visible}
          width='thin'
        >
            <Menu.Item as={NavLink} to='/dashboard/profile'>
                <Icon name='user circle' />
                {this.props.username}
            </Menu.Item>
            <Menu.Item as={NavLink} to='/dashboard/market'>
                <Icon name='bitcoin' />
                Market
            </Menu.Item>
            <Menu.Item as={NavLink} to='/dashboard/history'>
                <Icon name='table' />
                History
            </Menu.Item>
            <Menu.Item as='a' onClick={this.props.logout}>
                <Icon name='log out' />
                Logout
            </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
            <div style={{height: '100vh'}}>
        <Segment basic>
            <Button onClick={this.toggleBar} color='black' icon>
                <Icon inverted name='chevron left' />
            </Button>
            <Switch>
                <Route path='/dashboard/profile' render={() => {return <Profile username={this.props.username} />}} />
                <Route path='/dashboard/market' component={Market} />
                <Route path='/dashboard/history' component={History} />
                <Route component={NoPageFound}/>
            </Switch>
            
        </Segment>
        </div>
        </Sidebar.Pusher>
    </Sidebar.Pushable>
    </BrowserRouter>
    
    </div>
    )
    };

}

export default Dashboard
