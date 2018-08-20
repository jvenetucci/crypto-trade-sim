import React from 'react';
import { Tab, Container, Grid, Header, Segment } from 'semantic-ui-react'
import LoginWindow from "./../LoginWindow";
import RegisterWindow from "./../RegisterWindow";
import '../../styles/LoginPage.css';


const Login = (props) => {
    let callback = props.callback
    console.log(callback)
    const panes = [
        {menuItem: 'Login', render: () => <Tab.Pane><LoginWindow callback={callback} /></Tab.Pane>},
        {menuItem: 'Register', render: () => <Tab.Pane><RegisterWindow callback={callback}/></Tab.Pane>},
    ]

    return (
        <div>
            <Container fluid textAlign='center' className='Header'>
                <Header inverted as='h1'>Crypto Trade Sim</Header>
                <Header inverted as='h2'>
                    A cryptocurrency buying simulator
                </Header>
            </Container>

            <Grid centered className='Content'>
                <Grid.Column width={8}>
                    <Segment raised>
                        <Tab panes={panes} />
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default Login;