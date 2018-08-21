import React, {Component} from 'react';
import { Header, Icon, Container, Segment, Divider, Search, Button} from 'semantic-ui-react'
import axios from 'axios';
import fuse from 'fuse.js';
var coins = require('../../coins.json')

const fuseOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 16,
    minMatchCharLength: 1,
    keys: [
      "title",
      "description"
]};

class Market extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBarLoading: false,
            results: [],
            searchBarValue: ""
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

    handleSearchChange = (event, data) => {
        this.setState({searchBarLoading: true, searchBarValue: data.value});

        //Added this timeout because the loading was displaying correctly
        setTimeout( () => {
            var filter = new fuse(coins, fuseOptions);
            var results = filter.search(this.state.searchBarValue);
            this.setState({searchBarLoading: false, results: results});
        }, 300)
    }

    handleSearchConfirm = (event, data) => {
        const search = data.result.title;
        this.setState({searchBarValue: search});
        var queryString = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+ search +'&tsyms=USD';
        axios.get(queryString)
        .then((res) => {
            console.log(res.data.DISPLAY);
            if (!res.data.DISPLAY) {
                console.log("oops");
            }
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
                <Container>
                    <Search
                        loading={this.state.searchBarLoading}
                        onResultSelect={this.handleSearchConfirm}
                        onSearchChange={this.handleSearchChange}
                        results={this.state.results}
                        value={this.state.searchBarValue}
                    />
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

export default Market;