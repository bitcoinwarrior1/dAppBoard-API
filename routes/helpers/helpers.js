const APIKeyString = process.env.apiKeyString;
const request = require("superagent");

function rankByFunctionCallFrequency(txs) {
    //TODO clean up
    const calls = txs.map((a) => {
        return a.functionSignature + a.to + a.contractAddress;
    });
    return calls.byCount().map((call) => {
        return {
            functionSignature: call.substr(0, 8),
            to: call.substr(8, 50),
            contractAddress: call.substr(50) //for contract creations
        }
    });
}

// top 5 addresses this user sends ETH to
function getMostEthTransfers (txs) {
    const ethTransferTxs = txs.filter((tx) => { return tx.isEthTransfer; });
    const recipientsArray = ethTransferTxs.map((ethTransferTx) => {
        return ethTransferTx.to;
    });
    return recipientsArray.byCount().slice(0, Math.min(recipientsArray.length - 5, 5));
}

//contract addresses of the top 5 contracts the user uses most
async function getMostUsedContracts(ethersProvider, txs) {
    //TODO cheated by checking input as most transactions to EOA's have no input but this is not perfect
    // I abandoned using ethersProvider.getCode(recipient) !== "0x" as it was too slow to check for each address
    const txRecipientsContractsOnly = uniq(txs.map((tx) => {
        if(tx.input !== "0x") {
            return tx.to;
        }
    })).filter((to) => {
        return to !== "";
    });
    return txRecipientsContractsOnly.byCount().slice(0, Math.min(txRecipientsContractsOnly.length - 5, 5));
}

function getContractsYouCreated(txs) {
    const contracts = txs.map((tx) => {
        return tx.contractAddress;
    })
    return contracts.filter((contract) => {
        return contract !== "";
    })
}

// top 5 function signatures of the most popular function call on most used contracts
async function getMostCalledFunctions (txs) {
    const nonEthTransferTxs = txs.filter((tx) => { return !tx.isEthTransfer && tx.input !== ""; });
    const rankedTxs = rankByFunctionCallFrequency(nonEthTransferTxs);
    let top5Transactions = rankedTxs.slice(0, Math.min(nonEthTransferTxs.length - 5, 5));
    for(let index in top5Transactions) {
        try {
            let res = await request.get(`https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${top5Transactions[index].functionSignature}`);
            top5Transactions[index].functionSignature = res.text;
        } catch (e) {
            // Not found -- Do nothing
        }
    }
    return top5Transactions;
}

function uniq(a) {
    let seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

// finds pattern in transaction history e.g. claim NEST bonus and predicts when you will next do it
function getPredictedTransactions(txs) {
    return null; // TODO
}

function getEtherscanNormalTransactionsQuery(chainId, userAddress) {
     switch (chainId) {
        case 1:
            return "https://api.etherscan.io/api?module=account&action=txlist&address=" + userAddress + APIKeyString;
        case 3:
            return "https://ropsten.etherscan.io/api?module=account&action=txlist&address=" + userAddress + APIKeyString;
        case 4:
            return "https://rinkeby.etherscan.io/api?module=account&action=txlist&address=" + userAddress + APIKeyString;
        case 42:
            return "https://kovan.etherscan.io/api?module=account&action=txlist&address=" + userAddress + APIKeyString;
        default:
            return "https://api.etherscan.io/api?module=account&action=txlist&address=" + userAddress + APIKeyString;
    }
}

function getEtherscanInternalTransactionsQuery(chainId, userAddress) {
    switch (chainId) {
        case 1:
            return "https://api.etherscan.io/api?module=account&action=txlistinternal&address=" + userAddress + APIKeyString;
        case 3:
            return "https://ropsten.etherscan.io/api?module=account&action=txlistinternal&address=" + userAddress + APIKeyString;
        case 4:
            return "https://rinkeby.etherscan.io/api?module=account&action=txlistinternal&address=" + userAddress + APIKeyString;
        case 42:
            return "https://kovan.etherscan.io/api?module=account&action=txlistinternal&address=" + userAddress + APIKeyString;
        default:
            return "https://api.etherscan.io/api?module=account&action=txlistinternal&address=" + userAddress + APIKeyString;
    }
}

Array.prototype.byCount= function(){
    var itm, a= [], L= this.length, o= {};
    for(var i= 0; i<L; i++){
        itm= this[i];
        if(!itm) continue;
        if(o[itm]== undefined) o[itm]= 1;
        else ++o[itm];
    }
    for(var p in o) a[a.length]= p;
    return a.sort(function(a, b){
        return o[b]-o[a];
    });
}

module.exports = { getContractsYouCreated, getMostEthTransfers, getMostUsedContracts, getMostCalledFunctions, getPredictedTransactions, getEtherscanNormalTransactionsQuery, getEtherscanInternalTransactionsQuery };
