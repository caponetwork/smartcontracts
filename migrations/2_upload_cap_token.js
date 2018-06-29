const web3 = require('web3')
      , BigNumber = require('bignumber.js')
      , CAP = artifacts.require('./Token/CAP.sol');

let cap
    , uploadAccount
    , fundedAccount;

module.exports = (deployer, network, accounts) => {  
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
  });
};