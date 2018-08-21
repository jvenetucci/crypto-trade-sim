import React, { Component } from 'react';
import { Segment, Grid, Header, Image } from 'semantic-ui-react';
import axios from 'axios';


class CoinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coin : null,
            image: "",
            coinName: "",
            loading: false,
            price: null,
            data: null,
        }
    }

    componentWillReceiveProps(props) {
        console.log("This is in recieve props");
        console.log(props);
        console.log(this.state);
        if (props.coin && props.coin !== this.state.coin) {
            var queryString = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+ props.coin +'&tsyms=USD';
            axios.get(queryString)
            .then((res) => {
                console.log('I am making a request')
                console.log(res.data);
                this.setState({
                    price: res.data.RAW[props.coin].USD.PRICE,
                    data: res.data.DISPLAY[props.coin].USD,
                    coin: props.coin,
                    image: props.coinImage,
                    coinName: props.coinName
                })
            })
        }
 
    }

    componentDidMount() {
        console.log("This is in did mount")
        console.log(this.state)
        if(this.state.coin) {
            
        }
    }
    

    render() {
            console.log("This is in render");
            console.log(this.state);
        let VOLUME24HR = this.state.data.VOLUME24HR || '';
        let VOLUME24HRTO = this.state.data.VOLUME24HRTO || '';
        let HIGH24HR = this.state.data.HIGH24HR || '';
        let LOW24HR = this.state.data.LOW24HR || '';

        return (
            <Segment loading={this.state.loading} stacked>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                        <Image centered src={this.props.coinImage} size='mini' />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header as='h1'>{this.props.coinName}</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={8}>
                            <Header as='h1' color='green'>{this.setState.data.PRICE}</Header>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Header as='h3'>Volume Traded</Header> 
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Header as='h3'>{this.state.data.VOLUME24HR}</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={6}>
                            <Header as='h3'>24 HR High</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={3}>
                            <Header as='h3'>{this.state.data.HIGH24HR}</Header>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Header as='h3'>Volume Traded</Header> 
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Header as='h3'>{this.state.data.VOLUME24HRTO}</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={6}>
                            <Header as='h3'>24 HR Low</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={3}>
                            <Header as='h3'>{this.state.data.LOW24HR}</Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

export default CoinPage;