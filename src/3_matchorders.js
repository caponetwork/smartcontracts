const Capoproxy = artifacts.require('./CapoProxy.sol')
			, constants = require('../constants/constants')
			, BigNumber = require('bignumber.js')
			, DEV_ADDRESS = constants.DEV_ADDRESS			
			, order = require('../src/order.json')
			, web3 = require('web3');

let proxy;

module.exports = (deployer, network, accounts) => {
	Capoproxy.deployed()
	.then( instance => {
		console.log(instance.address);
		proxy = instance;
		let leftOrder = order.left;
		// leftOrder.makerAssetData = web3.utils.hexToBytes(leftOrder.makerAssetData);
		// leftOrder.takerAssetData = web3.utils.hexToBytes(leftOrder.takerAssetData);
		
		// leftOrder.expirationTimeSeconds = new BigNumber(leftOrder.expirationTimeSeconds);
    // leftOrder.salt = new BigNumber(leftOrder.salt);
    // leftOrder.makerAssetAmount = new BigNumber(leftOrder.makerAssetAmount);
		// leftOrder.takerAssetAmount = new BigNumber(leftOrder.takerAssetAmount);
		// leftOrder.makerFee = new BigNumber(leftOrder.makerFee);
		// leftOrder.takerFee = new BigNumber(leftOrder.takerFee);
		
		const leftOrderAddresses = [
			leftOrder.makerAddress,
			leftOrder.takerAddress,
			leftOrder.feeRecipientAddress,
			leftOrder.senderAddress
		];
		const leftOrderValues = [
			leftOrder.makerAssetAmount,
			leftOrder.takerAssetAmount,
			leftOrder.makerFee,
			leftOrder.takerFee,
			leftOrder.expirationTimeSeconds,
			leftOrder.salt
		];
		const leftOrderBytes = [
			leftOrder.makerAssetData,
			leftOrder.takerAssetData
		]

		let rightOrder = order.right;
		// rightOrder.makerAssetData = web3.utils.hexToBytes(rightOrder.makerAssetData);
		// rightOrder.takerAssetData = web3.utils.hexToBytes(rightOrder.takerAssetData);

		// rightOrder.expirationTimeSeconds = new BigNumber(rightOrder.expirationTimeSeconds);
    // rightOrder.salt = new BigNumber(rightOrder.salt);
    // rightOrder.makerAssetAmount = new BigNumber(rightOrder.makerAssetAmount);
		// rightOrder.takerAssetAmount = new BigNumber(rightOrder.takerAssetAmount);
		// rightOrder.makerFee = new BigNumber(rightOrder.makerFee);
		// rightOrder.takerFee = new BigNumber(rightOrder.takerFee);

		const rightOrderAddresses = [
			rightOrder.makerAddress,
			rightOrder.takerAddress,
			rightOrder.feeRecipientAddress,
			rightOrder.senderAddress
		];
		const rightOrderValues = [
			rightOrder.makerAssetAmount,
			rightOrder.takerAssetAmount,
			rightOrder.makerFee,
			rightOrder.takerFee,
			rightOrder.expirationTimeSeconds,
			rightOrder.salt
		];
		const rightOrderBytes = [
			rightOrder.makerAssetData,
			rightOrder.takerAssetData
		]

		



		const leftSignature = order.leftsig//web3.utils.hexToBytes(order.leftsig);
		const rightSignature = order.rightsig//web3.utils.hexToBytes(order.rightsig);	

		console.log(leftOrderAddresses);
		console.log(leftOrderValues);
		console.log(leftOrderBytes);
		console.log(rightOrderAddresses);
		console.log(rightOrderValues);
		console.log(rightOrderBytes);
		console.log(leftSignature);
		console.log(rightSignature);

		return proxy.matchOrders(
			leftOrderAddresses, 
			leftOrderValues,
			leftOrderBytes,
			rightOrderAddresses,
			rightOrderValues,
			rightOrderBytes,
			leftSignature,
			rightSignature,
			{from: DEV_ADDRESS}
		);
	})
	.then( result => {
		console.log(`result: ${result}`);
	})
	.catch(err => {
		console.log(err);
	});
};