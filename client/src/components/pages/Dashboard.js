import React from 'react'
import {Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import {NavLink, Switch} from 'react-router-dom';
import {Route , BrowserRouter} from 'react-router-dom'
import NoPageFound from './../pages/NoPageFound'
import Profile from './../pages/Profile';
import Market from './../pages/Market';
import History from './../pages/History';


const Dashboard = () => (
    <BrowserRouter>
    <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} 
          animation='uncover'
          icon='labeled' 
          inverted
          vertical 
          visible
          width='thin'
        >
            <Menu.Item as={NavLink} to='/dashboard/profile'>
                <Icon name='user circle' />
                username
            </Menu.Item>
            <Menu.Item as={NavLink} to='/dashboard/market'>
                <Icon name='bitcoin' />
                Market
            </Menu.Item>
            <Menu.Item as={NavLink} to='/dashboard/history'>
                <Icon name='table' />
                History
            </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
            <div style={{height: '100vh'}}>
        <Segment basic>
            <Switch>
                <Route path='/dashboard/profile' component={Profile} />
                <Route path='/dashboard/market' component={Market} />
                <Route path='/dashboard/history' component={History} />
                <Route component={NoPageFound}/>
            </Switch>
        </Segment>
        </div>
        </Sidebar.Pusher>
    </Sidebar.Pushable>
    </BrowserRouter>
)

export default Dashboard
