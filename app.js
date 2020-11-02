const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userInteractions = require("./getUserInteractions");

app.get("ethereum-interactions/:network/:address", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    let userAddress = req.params.address;
    let network = req.params.network;
    userInteractions.getUserInteractions(network, userAddress).then((result) => {

    }).catch(res.send);
});

app.listen(port, () => console.log(`listening at ${port}`));
