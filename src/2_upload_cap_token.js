const CAP = artifacts.require('./Token/CAP.sol')
      , constants = require('../constants/constants')
      , DEV_ADDRESS = constants.DEV_ADDRESS;

let cap
    , uploadAccount;    

module.exports = (deployer, network, accounts) => {
  console.log(network);
  uploadAccount = DEV_ADDRESS;    
  deployer.deploy(CAP, {from: uploadAccount})
  .then(instance => {    
    cap = instance;
    return cap.balanceOf(uploadAccount);
  })  
  .then(balance => {
    console.log(`${uploadAccount} balance: ${balance}`);
  });
};