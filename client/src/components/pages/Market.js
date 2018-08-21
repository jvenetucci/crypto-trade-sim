import React, {Component} from 'react';
import { Header, Icon, Container, Segment, Divider, Search, Message, Grid, Image, Form} from 'semantic-ui-react'
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
            tableLoading: false,
            results: [],
            searchBarValue: "",
            coin: null,
            coinImage: '',
            coinName: '',
            price: null,
            data: null,
            dispPrice: '',
            dispHigh: '',
            dispLow: '',
            dispVol: '',
            dispVolTo: '',
            disableForm: true,
            buyQuantity: '',
            buyPrice: '',
            showErr: true,
            showGood: true,
            goodStr: '',
            formLoad: false,
        }
    }

    getCoinInfo() {}

    buyCoin = () => {
        this.setState({
            showGood: true,
            showErr: true,
            formLoad: true,
        })
        axios.post('/buy', {
            currency: this.state.coin,
            quantity: this.state.buyQuantity,
            price: this.state.buyPrice
        }).then((res) => {
            var str = 'Bought ' + this.state.buyQuantity + ' ' + this.state.coin + ' for ' + this.state.buyPrice
            this.setState({
                goodStr: str,
                showGood: false,
                formLoad: false,

            })
        }).catch ((err) => {
            this.setState({
                showErr: false,
                formLoad: false,
            })
        })
    }

    handleChangeQuantity = (e, {value}) => {
        //calculate the price based on current price
        var price = value * this.state.price;
        this.setState({
            buyQuantity: value,
            buyPrice: price
        })
    }

    handleChangePrice = (e, {value}) => {
        //calculate the quantity based on current price
        var quant = value / this.state.price;
        this.setState({
            buyQuantity: quant,
            buyPrice: value
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
        this.setState({tableLoading: true})
        const search = data.result.title;
        var queryString = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+ search +'&tsyms=USD';
        axios.get(queryString)
        .then((res) => {
            console.log('I am making a request')
            console.log(res.data);
            this.setState({
                tableLoading: false,
                coin: search,
                coinImage: data.result.image,
                coinName: data.result.description,
                price: res.data.RAW[search].USD.PRICE,
                dispPrice: res.data.DISPLAY[search].USD.PRICE,
                dispHigh: res.data.DISPLAY[search].USD.HIGH24HOUR,
                dispLow: res.data.DISPLAY[search].USD.LOW24HOUR,
                dispVol: res.data.DISPLAY[search].USD.VOLUME24HOUR,
                dispVolTo: res.data.DISPLAY[search].USD.VOLUME24HOURTO,
                disableForm: false
            })
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
                <Segment raised inverted>
                    <Segment loading={this.state.tableLoading} stacked>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={2}>
                            <Image centered src={this.state.coinImage} size='mini' />
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Header as='h1'>{this.state.coinName}</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={8}>
                                <Header as='h1' color='green'>{this.state.dispPrice}</Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header as='h3'>Volume Traded</Header> 
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as='h3'>{this.state.dispVol}</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={6}>
                                <Header as='h3'>24 HR High</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={3}>
                                <Header as='h3'>{this.state.dispHigh}</Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header as='h3'>Volume Traded</Header> 
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as='h3'>{this.state.dispVolTo}</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={6}>
                                <Header as='h3'>24 HR Low</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={3}>
                                <Header as='h3'>{this.state.dispLow}</Header>
                            </Grid.Column>
                        </Grid.Row>

                            
                    </Grid>
                    <Form onSubmit={this.buyCoin} loading={this.state.formLoad}>
                        <Form.Group>
                            <Form.Button disabled={this.state.disableForm} fluid width={4}>Buy</Form.Button>
                            <Form.Input disabled={this.state.disableForm} 
                                width={6} 
                                label='Coins' 
                                placeholder='' 
                                value={this.state.buyQuantity}
                                onChange={this.handleChangeQuantity}/>
                            <Form.Input  
                                disabled={this.state.disableForm} 
                                width={6} 
                                label='Price' 
                                placeholder=''
                                value={this.state.buyPrice}
                                onChange={this.handleChangePrice}/>
                        </Form.Group>
                    </Form>
                </Segment>
                </Segment>
    
                <Message positive hidden={this.state.showGood}>
                    <Message.Header>Success!</Message.Header>
                    <p>{this.state.goodStr}</p>
                </Message>
                <Message error hidden={this.state.showErr}>
                    <Message.Header>Error!</Message.Header>
                    <p>You do not have enough funds to complete the purchase</p>
                </Message>
                </Container>
                        
            </div>
        );
    }
    
};

export default Market;