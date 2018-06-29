const CAP = artifacts.require('./Token/CAP.sol')
			, BigNumber = require('bignumber.js');

let cap
    , owner
    , fundedAccount
    , user1
    , user2
    , user3;

module.exports = (deployer, network, accounts) => {
	owner = accounts[0];
	fundedAccount = accounts[1];
	user1 = accounts[2];
	user2 = accounts[3];
	user3 = accounts[4];

	CAP.deployed()
	.then((instance) => {
		cap = instance;
		const amountToTransfer = (new BigNumber(10**18)).times(100);
		return Promise.all([
			cap.transfer(fundedAccount, amountToTransfer.toNumber(), {from: owner}),
			cap.transfer(user1, amountToTransfer.toNumber(), {from: owner}),
			cap.transfer(user2, amountToTransfer.toNumber(), {from: owner}),
			cap.transfer(user3, amountToTransfer.toNumber(), {from: owner})
		]);		
	})
	.then(() => {
		return Promise.all([
			cap.balanceOf(fundedAccount),
			cap.balanceOf(user1),
			cap.balanceOf(user2),
			cap.balanceOf(user3)
		]);		
	})
	.then((balances) => {
		console.log(`
		balance of ${fundedAccount}: ${balances[0]}
		balance of ${user1}: ${balances[1]}
		balance of ${user2}: ${balances[2]}
		balance of ${user3}: ${balances[3]}
		`);
	})
	.catch((err) => {
		console.log(err);
	});
}