import React, {Component} from 'react';
import { Header, Icon, Container, Grid, Segment, Divider, Table,} from 'semantic-ui-react'
import HistoryRow from '../HistoryRow'
import axios from 'axios';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            loading: true
        }
    }

    componentDidMount() {
        axios.get('/history')
        .then((res) => {
            console.log(res.data);
            this.setState({
                history: res.data,
                loading: false
            })
        })

        
    }
    
    render() {
        const rows = this.state.history.map((x) =>
         <HistoryRow key={x.toCurrency} history={x}/>);
        return (
            <div>
                <Container>
                <Segment raised>
                <Header as='h1' icon textAlign = 'center'>
                    <Icon circular name='briefcase' />
                    Transaction History
                    <Header.Subheader>{this.props.username}</Header.Subheader>
                </Header>
                </Segment>
    
                <Divider />
    
                <Segment loading={this.state.loading} inverted raised>
                    <Segment stacked>
                        <Grid>
                            <Grid.Column width={4}>
                            <Header as='h2'>
                                Transactions: 
                            </Header>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Header color='blue' as='h2' textAlign='right'>
                                    {this.state.history.length}
                                </Header>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment stacked>
                        <Header as='h2'>Transaction History:</Header>
                        <Table inverted celled>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Buy/Sell</Table.HeaderCell>
                                <Table.HeaderCell>To</Table.HeaderCell>
                                <Table.HeaderCell>From</Table.HeaderCell>
                                <Table.HeaderCell>Quantity</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>
                                {rows}
                            <Table.Body>
                            </Table.Body>
                        </Table>
                    </Segment>
                </Segment>
    
                </Container>
                        
            </div>
        );
    }
    
};

export default History;