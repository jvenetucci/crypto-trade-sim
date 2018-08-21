// Use this script to parse the entire list of coins from https://min-api.cryptocompare.com/data/all/coinlist
// Store the data from that endpoint in coinList.json for this script to work.

const file = require('fs');
var data = require("./coinList.json");

var coins = [];
for (coin in data.Data) {
    let coinData = data.Data[coin];
    if (coinData.IsTrading) {
        var coinJSON = {
            title: coinData.Name,
            description: coinData.CoinName,
            image: 'https://www.cryptocompare.com' + coinData.ImageUrl
        }
        coins.push(coinJSON);
    }
}

file.writeFile('coins.json', JSON.stringify(coins), (err) => {
    if (err) {  
        console.log(err)
    } else {
        console.log("Finished");
    }
});