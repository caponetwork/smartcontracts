const Capoproxy = artifacts.require('./CapoProxy.sol');
const constants = require('../constants/constants');

let proxy;
module.exports = (deployer, network, accounts) => {
	Capoproxy.deployed()
	.then( (instance) => {
		proxy = instance;
		return proxy.getAuthorizedAddresses();
	})
	.then( async addresses => {
		console.log(`authorized addresses: ${addresses}`);
		
		// Add authorized address
		const authorizedAddresses = [
			constants.DEV2
		]

		console.log(`start add authorized address`);
		for (let index = 0; index < authorizedAddresses.length; index++) {
			const address = authorizedAddresses[index];
			console.log(`add: ${address}`);
			const receipt = await proxy.addAuthorizedAddress(address);
			console.log(`done with receipt: ${JSON.stringify(receipt)}`);
		}		
		console.log(`end add authorized address`);

		return proxy.getAuthorizedAddresses();
	})
	.then( addresses => {
		console.log(`authorized addresses: ${addresses}`);
	})
	.catch( err => {
		console.log(err);
	});
};