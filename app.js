const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { getUserInteractionsRanked } = require("./routes/getUserInteractionsRanked");

app.get("/ethereum-interactions/:network/:address", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    let userAddress = req.params.address;
    let network = req.params.network;
    getUserInteractionsRanked(network, userAddress).then((result) => {
        res.send(result.categories);
    }).catch((err) => {
        res.send(err);
    });
});

app.listen(port, () => console.log(`listening at ${port}`));
