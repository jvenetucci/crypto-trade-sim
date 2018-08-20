import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, Container, Grid, Header, Segment } from 'semantic-ui-react'
import LoginWindow from "./../LoginWindow";
import RegisterWindow from "./../RegisterWindow";
import '../../styles/LoginPage.css';

const panes = [
    {menuItem: 'Login', render: () => <Tab.Pane><LoginWindow /></Tab.Pane>},
    {menuItem: 'Register', render: () => <Tab.Pane><RegisterWindow /></Tab.Pane>},
]
const Login = () => (
    <div>
        <Container fluid textAlign='center' className='Header'>
            <Header inverted as='h1'>Crypto Trade Sim</Header>
            <Header inverted as='h2'>
                A cryptocurrency buying simulator
            </Header>
        </Container>

        <Grid centered classname='Content'>
            <Grid.Column width={8}>
                <Segment raised>
                    <Tab panes={panes} />
                </Segment>
            </Grid.Column>
        </Grid>
    </div>
)

export default Login;