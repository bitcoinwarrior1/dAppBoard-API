/*
*  get the ether balance
*  get all the token balances
*  check the price in and based on method (FIFO or LIFO) find the price of acquisition vs disposal
*  find the total net or loss
* */

const Ethers = require('ethers');
let provider = Ethers.providers.getDefaultProvider("mainnet");
const request = require("superagent");

export async function getUserInteractions(network, userAddress) {
    let resultObj = {};
    provider = Ethers.providers.getDefaultProvider(network);
}


