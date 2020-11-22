# dAppBoard-API
Find the most common on chain interactions you do on ethereum for a specific address

- Most eth transfers to
- Most used contracts
- Contracts you created 
- Most called functions

## Getting started
- `npm i` to install dependencies 
- `npm start` to run the server. If local it will run on `https://localhost:3000/` 


## Example call:
`$ curl https://dapp-panel-api.herokuapp.com/ethereum-interactions/mainnet/0xfe6d4bc2de2d0b0e6fe47f08a28ed52f9d052a02`

returns:
`{"mostEthTransfersTo":["0xfe6d4bc2de2d0b0e6fe47f08a28ed52f9d052a02","0x0d590124d2faabbbdfa5561ccbf778914a50bcca","0xce782b43481f0c9c7c567159b0bfd546025c1fd4","0xde6b14fafa8e4bd2a9eb19a1133e26c14b2477d5","0x817c0677179bbe0af249cb5a5539c420767b9529"],"mostUsedContracts":["0x7da3543db64b08764bc91a7bd55dee55e27925d9","0x02c4adeb884d55d7502c828aab5dd29966c40b9c","0x6daa9f1496d9eb6842b9b01303c2a3509a56a8fd","0xfe6d4bc2de2d0b0e6fe47f08a28ed52f9d052a02","0x5f83a1186f89213cf280fe6971ca85ba578ae353"],"contractsYouCreated":["0x7da3543db64b08764bc91a7bd55dee55e27925d9","0xbb12033d057a914bcc9e480a9cf266cf05548de9","0x3b79dbd9942bab53aeec6a031f6e8b3c8ca46b17","0xe97c0c5e16c1ea89606df1da618465f3c31d2a11","0xb80463f354b54b958e88b4d5385693bb554cbd8e","0x7f2a6fb65bcb31c56872d6e9bf48016292d7e198","0x02c4adeb884d55d7502c828aab5dd29966c40b9c","0x6daa9f1496d9eb6842b9b01303c2a3509a56a8fd","0x5f83a1186f89213cf280fe6971ca85ba578ae353","0x04f925b8ff7e457d6daf6ff677ba36ac8ff4719d","0x378d9454b8ece655e77dd568e4aeeafbfbfe8a14","0x277b1318965030c62e1dac9671a6f8df77f855cf","0xdbc5934463effb93a770c62efee4feaeaf462ede","0xa66a3f08068174e8f005112a8b2c7a507a822335","0xba9c4981c091ea94bf28cdcd19d0eec2e5445573","0xc27a404860708c7d17a899df96043647a1a6c313","0xab34a8b5df7048c971f50dfa38d5e45d50638ec7"],"mostCalledFunctions":[{"functionSignature":"passTo(uint256,uint16[],uint8,bytes32,bytes32,address)","to":"0xa66a3f08068174e8f005112a8b2c7a507a822335","contractAddress":""},{"functionSignature":"passTo(uint256,uint16[],uint8,bytes32,bytes32,address)","to":"0x277b1318965030c62e1dac9671a6f8df77f855cf","contractAddress":""},{"functionSignature":"fill(address,uint256,address,address,uint256,address,uint256,uint256,uint8,bytes32,bytes32)","to":"0x8fd3121013a07c57f0d69646e86e7a4880b467b7","contractAddress":""},{"functionSignature":"457e2c5e","to":"0x83912b4c3294587306f5a64b72bb6351b52e555d","contractAddress":""},{"functionSignature":"approve(address,uint256)","to":"0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359","contractAddress":""}]}`
