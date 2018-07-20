const CAP = artifacts.require('./Token/CAP.sol')
			, BigNumber = require('bignumber.js')
			, constants = require('../constants/constants')
			, DEV_ADDRESS = constants.DEV_ADDRESS;
			
const	FUNDED_ADDRESSES = [
	constants.DEV3, constants.DEV4, constants.DEV5, constants.DEV6, constants.DEV7, constants.DEV8,
	constants.DEV9, constants.USER1, constants.USER2, constants.USER3, constants.USER4
]			

let cap
    , owner;

module.exports = (deployer, network, accounts) => {
	console.log(network);
	owner = DEV_ADDRESS;	
	CAP.deployed()
	.then((instance) => {
		cap = instance;
		const amountToTransfer = (new BigNumber(10**18)).times(1000);
		let transfers = [];
		FUNDED_ADDRESSES.forEach( address => {
			transfers.push(
				cap.transfer(address, amountToTransfer.toNumber(), {from: owner})
			)
		});		
		return Promise.all(transfers);		
	})
	.then(() => {
		let balances = [];
		FUNDED_ADDRESSES.forEach( address => {
			balances.push(
				cap.balanceOf(address)
			)
		})
		return Promise.all(balances);		
	})
	.then(balances => {
		console.log(`Balances: ${balances}`);
	})
	.catch((err) => {
		console.log(err);
	});
}