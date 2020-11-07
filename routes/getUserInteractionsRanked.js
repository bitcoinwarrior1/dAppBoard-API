const Ethers = require('ethers');
let provider = null;
const request = require("superagent");
const { getEtherscanNormalTransactionsQuery,
    getEtherscanInternalTransactionsQuery,
    getMostEthTransfers,
    getMostUsedContracts,
    getMostCalledFunctions,
    getPredictedTransactions,
    getContractsYouCreated
} = require("./helpers/helpers");
const projectId = process.env.projectId;
const projectSecret = process.env.projectSecret;

/*
* @param network: the ethereum blockchain network
* @param userAddress: the address of the user which will be checked up on
* @returns an object containing transaction data about the user
* */
async function getUserInteractionsRanked(network, userAddress) {
    provider = new Ethers.providers.InfuraProvider("homestead", {
        projectId: projectId,
        projectSecret: projectSecret
    });
    let results = {};
    results.normalTransactions = await getNormalTransactions(userAddress);
    results.internalTransactions = await getInternalTransactions(userAddress);
    results.categories = await classifyTransactionsIntoCategories(results);
    return results;
}

/*
*  @param resultsObj, an object with two keys: normalTransactionsRanked & internalTransactionsRanked
*  @returns classifiedTransactions an object
*  */
async function classifyTransactionsIntoCategories(resultsObj) {
    let categories = {};
    const txs = resultsObj.normalTransactions.concat(resultsObj.internalTransactions);
    categories.mostEthTransfersTo = getMostEthTransfers(txs);
    categories.mostUsedContracts = await getMostUsedContracts(provider, txs);
    categories.contractsYouCreated = getContractsYouCreated(txs);
    categories.mostCalledFunctions = await getMostCalledFunctions(txs);
    // categories.predictedTransactions = getPredictedTransactions(txs);
    return categories;
}

/*
* ranks the most common normal transactions in desending order
* @param userAddress: the address of the user which will be checked up on
* @returns object of transactions ranked by how often they are called
*  */
async function getNormalTransactions(userAddress) {
    const query = getEtherscanNormalTransactionsQuery(parseInt(provider.chainId, 16), userAddress);
    try {
        const res = await request.get(query);
        const results = res.body.result;
        let transactions = [];
        for(let result of results) {
            let transactionDetails = result;
            transactionDetails.isEthTransfer = result.input === "0x";
            if(result.input === "0x") {
                transactionDetails.functionSignature = "transferEth";
            } else {
                transactionDetails.functionSignature = result.input.substr(2, 8);
            }
            transactions.push(transactionDetails);
        }
        return transactions;
    } catch (e) {
        return e;
    }
}

/*
* ranks the most common internal transactions in desending order
* @param userAddress: the address of the user which will be checked up on
* @returns object of transactions ranked by how often they are called
*  */
async function getInternalTransactions(userAddress) {
    const query = getEtherscanInternalTransactionsQuery(parseInt(provider.chainId, 16), userAddress);
    try {
        const res = await request.get(query);
        const results = res.body.result;
        let transactions = [];
        for(let result of results) {
            let transactionDetails = result;
            transactionDetails.isEthTransfer = false;
            transactionDetails.functionSignature = result.input.substr(0, 8);
            transactions.push(transactionDetails);
        }
        return transactions;
    } catch (e) {
        return e;
    }
}

module.exports = { getUserInteractionsRanked };
