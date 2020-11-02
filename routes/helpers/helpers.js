module.exports = {

    rankByFunctionSignature: (arr) => {
        return arr.sort((a,b) =>
            arr.filter(v => v.functionSignature===a.functionSignature).length
            - arr.filter(v => v.functionSignature===b.functionSignature).length
        ); //.pop();
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
