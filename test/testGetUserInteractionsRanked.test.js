const { expect } = require('chai');
const { getUserInteractionsRanked } = require("../routes/getUserInteractionsRanked.js");
const dummyAccount = "0xFE6d4bC2De2D0b0E6FE47f08A28Ed52F9d052A02";
const mostPopularFunctionHash = "48c54b9d";

describe('getUserInteractionsRanked works as expected', () => {

    before("make one call for all transactions", async () => {
        this.txs = await getUserInteractionsRanked("mainnet", dummyAccount);
    });

    it("can get normalTransactions, classifiedTransactions & internalTransactions", async () => {
        expect(this.txs.normalTransactionsRanked).to.not.equal(undefined, "successfully retrieved normal transactions");
        expect(this.txs.internalTransactionsRanked).to.not.equal(undefined, "successfully retrieved internal transactions");
        expect(this.txs.classifiedTransactions).to.not.equal(undefined, "successfully retrieved classified transactions");
        console.log(this.txs.classifiedTransactions)
    });

    it("can rank transactions by popularity", async () => {
        expect(this.txs.normalTransactionsRanked[0].functionSignature).to.equal(mostPopularFunctionHash);
    });

})
