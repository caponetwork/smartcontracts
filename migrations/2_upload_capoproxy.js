const Capoproxy = artifacts.require('./CapoProxy.sol')
			, constants = require('../constants/constants')
			, DEV_ADDRESS = constants.DEV_ADDRESS
			, ExchangeAddress = constants.ExchangeAddress
			, WETHAddress = constants.WETHAddress;
			
let proxy;

module.exports = (deployer, network, accounts) => {
	deployer.deploy(Capoproxy, WETHAddress, {overwrite: true, from: DEV_ADDRESS})
	.then( instance => {
		proxy = instance;
		return proxy.getAuthorizedAddresses();
	})	
	.then( async addresses => {
		console.log(`authorized addresses: ${addresses}`);
		
		// Add authorized address
		const authorizedAddresses = [
			constants.DEV3,
			constants.DEV4,
			constants.DEV5,
			constants.DEV6,
			constants.DEV7,
			constants.DEV8,
			constants.DEV9,
			constants.DEV10,
			constants.USER1,
			constants.USER2,
			constants.USER3,
			constants.USER4,
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