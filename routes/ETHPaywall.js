const webmasterAddress = "";
const ethers = require("ethers");
const accessFee = ethers.utils.formatUnits(0.00001, "ether");
const accessFeeMessage = "Transfer 0.00001 ETH";
let usedSignatures = []; // TODO use persistence
const payload = "Transfer 0.001 ETH\n" +
    "To: 0xfe6d4bc2de2d0b0e6fe47f08a28ed52f9d052a02\n" +
    "Nonce: 2\n" +
    "Fee: 0.00000475 ETH\n" +
    "Account Id: 6084"; //TODO does this change via the recipient

function validatePaywall(paywallObj) {
    if(hasSubscription(paywallObj)) return true;
    let payload = paywallObj.payload;
    let signature = paywallObj.signature;
    let hasValidParams = checkParams(payload);
    if(!hasValidParams) return false;
    return paymentObjectValid(payload);
}

// TODO if the user has not paid via ETH L2 but has a valid subscription then they should be allowed to bypass this
function hasSubscription(paywallObj) {
    return false;
}

function checkParams(msg) {
    return !(!msg.includes(accessFeeMessage) || !msg.includes(webmasterAddress));
}

//TODO publish to zksync server and see if it is valid
function paymentObjectValid(paywallObject) {
    return true;
}

module.exports = { validatePaywall, payload };
