const web3 = require('web3');
const BigNumber = require('bignumber.js');
var CAP = artifacts.require('./Token/CAP.sol');

var cap;
var uploadAccount;
var fundedAccount;
module.exports = function(deployer, network, accounts) {  
	uploadAccount = accounts[0];
	fundedAccount = accounts[1];
	console.log(`fundedAccount: ${fundedAccount}`);	
  	deployer.deploy(CAP, {from: uploadAccount})
  	.then(function(instance) {
		cap = instance;
		return cap.balanceOf(uploadAccount);
  	})
  	.then(function(balance) {
  		console.log(`${uploadAccount} balance: ${balance}`);
  		var amount = new BigNumber(10**18).toString();
  		console.log(`amount: ${amount}`);
  		return cap.transfer(fundedAccount, web3.utils.toHex(amount), {from: uploadAccount});
  	})
  	.then(function(result) {
  		console.log(result);
  	});
};