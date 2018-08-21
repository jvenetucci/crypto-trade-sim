import React from 'react';
import { Tab, Container, Grid, Header, Segment, Button, Icon } from 'semantic-ui-react'
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

            <Grid centered className='Content'>
                <Segment raised>
                <Grid.Row>
                    <Grid.Column textAlign='center' width={8}>
                        <Header as="h3">Created by Joseph Venetucci</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center' width={8}>
                        <Button as='a' href='https://github.com/jvenetucci/crypto-trade-sim' color='instagram' icon>
                            <Icon name='github' />
                        </Button>
                        <Button as='a' href='https://www.linkedin.com/in/joseph-venetucci/' color='instagram' icon>
                            <Icon name='linkedin' />
                        </Button>                    
                    </Grid.Column>
                </Grid.Row>
                </Segment>
            </Grid>

            
        </div>
    );
}

export default Login;