import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Grid, Header, Image, Menu, Segment } from 'semantic-ui-react'
import LoginWindow from "./../LoginWindow";

const Login = () => (
    <div>
        <Container fluid textAlign='center' style={{ background: 'black', padding: '2em' }}>
            <Header inverted as='h1'>Crypto Trade Sim</Header>

            <Header inverted as='h2'>
                A cryptocurrency buying simulator
            </Header>
        </Container>

        <Grid centered>
            <Grid.Column width={8}>
                <LoginWindow />
            </Grid.Column>
        </Grid>

        <Segment inverted vertical style={{ padding: '5em 0em'}}>
        <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
    </div>
)

export default Login;