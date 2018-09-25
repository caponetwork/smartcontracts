const TUSD = artifacts.require('./Token/TUSD.sol')
      , constants = require('../constants/constants')
      , DEV_ADDRESS = constants.DEV_ADDRESS;

let tusd
    , uploadAccount;    

module.exports = (deployer, network, accounts) => {
  console.log(network);
  uploadAccount = DEV_ADDRESS;    
  deployer.deploy(TUSD, {from: uploadAccount})
  .then(instance => {    
    tusd = instance;
    return tusd.balanceOf(uploadAccount);
  })  
  .then(balance => {
    console.log(`${uploadAccount} balance: ${balance}`);
  });
};