const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { getUserInteractionsRanked } = require("./routes/getUserInteractionsRanked");
const { validatePaywall, payload } = require("./routes/ETHPaywall");

app.get("/ethereum-interactions/:network/:address/:paywallObj", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    let paywallObj = req.params.paywallObj;
    let userAddress = req.params.address;
    let network = req.params.network;
    let hasPaid = validatePaywall(paywallObj);
    if(hasPaid) {
        getUserInteractionsRanked(network, userAddress).then((result) => {
            res.send(result.categories);
        }).catch((err) => {
            res.send(err);
        });
    } else {
        res.send("Please pay to access the content");
    }
});

app.get("/paywallPayload", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    res.send(payload);
});

app.listen(port, () => console.log(`listening at ${port}`));
