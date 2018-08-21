import React, {Component} from 'react';
import { Header, Icon, Container, Segment, Divider, Search, Button} from 'semantic-ui-react'
import axios from 'axios';


class Market extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    getCoinInfo() {}

    buyCoin() {
        axios.post('/buy', {
            currency: 'BTC',
            quantity: 1,
            price: 5500
        }).then((res) => {
            alert("Bought 1 bitcoin for 5500");
        }).catch ((err) => {
            alert("Failed to buy");
        })
    }
    
    render() {
    
        return (
            <div>
                <Container>
                <Segment raised>
                <Header as='h1' icon textAlign = 'center'>
                    <Icon circular name='shop' />
                    Buy Coins
                    <Header.Subheader>{this.props.username}</Header.Subheader>
                </Header>
                </Segment>
    
                <Divider />
                <Container textAlign='center'>
                    
                </Container>
                <Divider />
                <Segment stacked>
                    <Button onClick={this.buyCoin}>Buy 1 Bitcoin for $5500</Button>
                </Segment>
    
                </Container>
                        
            </div>
        );
    }
    
};

{/* <Search
                        loading={false}
                        onResultSelect={this.buyCoin}
                        value={}
                        size='big'
                    /> */}

 {/* <Segment loading={this.state.loading} inverted raised>
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
                </Segment> */}

export default Market;