module.exports = {

    // top 5 addresses this user sends ETH to
    getMostEthTransfers: (txs) => {
        const ethTransferTxs = txs.filter((tx) => { return tx.isEthTransfer; });
        return ethTransferTxs.sort((a,b) =>
            ethTransferTxs.filter(v => v.to===a.to).length
            - ethTransferTxs.filter(v => v.to===b.to).length
        ).slice(Math.max(ethTransferTxs.length - 5, 0));
    },

    //contract addresses of the top 5 contracts the user uses most
    getMostUsedContracts: async (ethersProvider, txs) => {
        const txRecipients = txs.map((tx) => {
           return tx.to;
        });
        let txRecipientsContractsOnly = [];
        for(let recipient of txRecipients) {
            if(await ethersProvider.getCode(recipient) !== "0x") {
                txRecipientsContractsOnly.push(recipient);
            }
        }
        return txRecipientsContractsOnly.sort((a,b) =>
            txRecipientsContractsOnly.filter(v => v===a).length
            - txRecipientsContractsOnly.filter(v => v===b).length
        ).slice(Math.max(txRecipientsContractsOnly.length - 5, 0));
    },

    // top 5 function signatures of the most popular function call on most used contracts
    getMostCalledFunctions: (txs) => {
        const nonEthTransferTxs = txs.filter((tx) => { return !tx.isEthTransfer; });
        return this.rankByFunctionSignature(nonEthTransferTxs).slice(Math.max(nonEthTransferTxs.length - 5, 0))
    },

    // finds pattern in transaction history e.g. claim NEST bonus and predicts when you will next do it
    getPredictedTransactions: (txs) => {
        return txs; // TODO
    },

    rankByFunctionSignature: (arr) => {
        return arr.sort((a,b) =>
            arr.filter(v => v.functionSignature===a.functionSignature).length
            - arr.filter(v => v.functionSignature===b.functionSignature).length
        );
    },

    getEtherscanNormalTransactionsQuery: (chainId, userAddress) => {
        const APIKeyString = process.env.apiKeyString || "&apikey=ANVBH7JCNH1BVHJ1NPB5FH1WKP5C6YSYJW";
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
    },

    getEtherscanInternalTransactionsQuery: (chainId, userAddress) => {
        const APIKeyString = process.env.apiKeyString || "&apikey=ANVBH7JCNH1BVHJ1NPB5FH1WKP5C6YSYJW";
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
};
