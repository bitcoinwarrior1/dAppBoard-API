const Ethers = require('ethers');
let provider = Ethers.providers.getDefaultProvider("mainnet");
const request = require("superagent");
const { rankByFunctionSignature,
    getEtherscanNormalTransactionsQuery,
    getEtherscanInternalTransactionsQuery,
    getMostEthTransfers,
    getMostUsedContracts,
    getMostCalledFunctions,
    getPredictedTransactions
} = require("./helpers/helpers");

/*
* @param network: the ethereum blockchain network
* @param userAddress: the address of the user which will be checked up on
* @returns an object containing transaction data about the user
* */
async function getUserInteractionsRanked(network, userAddress) {
    provider = Ethers.providers.getDefaultProvider(network);
    let results = {};
    results.normalTransactionsRanked = await getNormalTransactionsRanked(userAddress);
    results.internalTransactionsRanked = await getInternalTransactionsRanked(userAddress);
    results.classifiedTransactions = await classifyTransactionsIntoCategories(results);
    return results;
}

/*
*  @param resultsObj, an object with two keys: normalTransactionsRanked & internalTransactionsRanked
*  @returns classifiedTransactions an object
*  */
async function classifyTransactionsIntoCategories(resultsObj) {
    let classifiedTransactions = {};
    const txs = resultsObj.normalTransactionsRanked.concat(resultsObj.internalTransactionsRanked);
    classifiedTransactions.mostEthTransfersTo = getMostEthTransfers(txs);
    classifiedTransactions.mostUsedContract = await getMostUsedContracts(provider, txs);
    classifiedTransactions.mostCalledFunctions = getMostCalledFunctions(txs);
    classifiedTransactions.predictedTransactions = getPredictedTransactions(txs);
    return classifiedTransactions;
}

/*
* ranks the most common normal transactions in desending order
* @param userAddress: the address of the user which will be checked up on
* @returns object of transactions ranked by how often they are called
*  */
async function getNormalTransactionsRanked(userAddress) {
    const query = getEtherscanNormalTransactionsQuery(parseInt(provider.chainId, 16), userAddress);
    try {
        const res = await request.get(query);
        const results = res.body.result;
        let transactions = [];
        for(let result of results) {
            let transactionDetails = result;
            transactionDetails.isEthTransfer = result.input === "0x";
            let functionSignature = "";
            if(result.input === "0x") {
                functionSignature = "transferEth";
            } else {
                let bytesSignature = result.input.substr(2, 8);
                try {
                    let res = await request.get(`https://raw.githubusercontent.com/ethereum-lists/
                    4bytes/master/signatures/${bytesSignature}`);
                    functionSignature = res.body.result
                    console.log(functionSignature)
                } catch (e) {
                    functionSignature = bytesSignature;
                }
            }
            transactionDetails.functionSignature = functionSignature; // 4bytes, eth transfer or function signature
            transactions.push(transactionDetails);
        }
        return rankByFunctionSignature(transactions);
    } catch (e) {
        return e;
    }
}

/*
* ranks the most common internal transactions in desending order
* @param userAddress: the address of the user which will be checked up on
* @returns object of transactions ranked by how often they are called
*  */
async function getInternalTransactionsRanked(userAddress) {
    const query = getEtherscanInternalTransactionsQuery(parseInt(provider.chainId, 16), userAddress);
    try {
        const res = await request.get(query);
        const results = res.body.result;
        let transactions = [];
        for(let result of results) {
            let transactionDetails = result;
            transactionDetails.isEthTransfer = false;
            let bytesSignature = result.input.substr(0, 8);
            try {
                const functionSignatureQuery = `https://raw.githubusercontent.com/ethereum-lists/
                4bytes/master/signatures/${bytesSignature}`;
                transactionDetails.functionSignature = await request.get(functionSignatureQuery);
            } catch (e) {
                transactionDetails.functionSignature = bytesSignature;
            }
            transactions.push(transactionDetails);
        }
        return rankByFunctionSignature(transactions);
    } catch (e) {
        return e;
    }
}

module.exports = { getUserInteractionsRanked };
