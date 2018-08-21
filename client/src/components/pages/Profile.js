import React, {Component} from 'react';
import { Header, Icon, Container, Grid, Segment, Divider, Table, Menu, Label } from 'semantic-ui-react'
import HoldingsRow from '../HoldingsRow'
import axios from 'axios';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holdings: [],
            currentVal: 0,
            loading: true
        }
    }

    componentDidMount() {
        axios.get('/holdings')
        .then((res) => {
            var currentVal = 0;
            res.data.forEach ((element) => {currentVal += element.price})
            this.setState({
                holdings: res.data,
                currentVal: currentVal,
                loading: false
            })
        })

        
    }
    
    render() {
        const rows = this.state.holdings.map((x) =>
         <HoldingsRow key={x.currency} currency={x.currency} quantity={x.quantity} price={x.price}/>);
        return (
            <div>
                <Container>
                <Segment raised>
                <Header as='h1' icon textAlign = 'center'>
                    <Icon name='user circle' />
                    User Profile
                    <Header.Subheader>{this.props.username}</Header.Subheader>
                </Header>
                </Segment>
    
                <Divider />
    
                <Segment loading={this.state.loading} inverted raised>
                    <Segment stacked>
                        <Grid>
                            <Grid.Column width={4}>
                            <Header as='h2'>
                                Net Worth:
                            </Header>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Header color='green' as='h2' textAlign='right'>
                                    ${this.state.currentVal}
                                </Header>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment stacked>
                        <Header as='h2'>Current Holdings:</Header>
                        <Table inverted celled>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Currency</Table.HeaderCell>
                                <Table.HeaderCell>Quantity</Table.HeaderCell>
                                <Table.HeaderCell>Current Value</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>
    
                            <Table.Body>
                                {rows}
                            </Table.Body>
                        </Table>
                    </Segment>
                </Segment>
    
                </Container>
                        
            </div>
        );
    }
    
};

export default Profile;