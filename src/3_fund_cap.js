const CAP = artifacts.require('./Token/CAP.sol')
			, BigNumber = require('bignumber.js')
			, constants = require('../constants/constants')
			, DEV_ADDRESS = constants.DEV_ADDRESS;
			
const	FUNDED_ADDRESSES = [
	constants.DEV3
]			

let cap
    , owner;

module.exports = (deployer, network, accounts) => {
	console.log(network);
	owner = DEV_ADDRESS;	
	CAP.deployed()
	.then( async (instance) => {
		cap = instance;
		const amountToTransfer = (new BigNumber(10**18)).times(1000);
		for (const address in FUNDED_ADDRESSES) {
			console.log(`transfer to: ${address}`);
			const result = await cap.transfer(address, amountToTransfer.toNumber(), {from: owner});
			console.log(`result: ${JSON.stringify(result)}`);
			const balance = await cap.balanceOf(address);
			console.log(`balance: ${balance}`);
		}
		return;
	})
	.catch((err) => {
		console.log(err);
	});
}