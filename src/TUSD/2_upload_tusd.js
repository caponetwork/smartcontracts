const TUSD = artifacts.require('./Token/TUSD.sol')
      , constants = require('../../constants/constants')
      , DEV_ADDRESS = constants.DEV_ADDRESS;

let tusd;
let uploadAccount;

const options = {
  overwrite: false
};

module.exports = (deployer, network, accounts) => {
  console.log(network);
  if (network === 'develop') {
    uploadAccount = accounts[0];
  } else {
    uploadAccount = DEV_ADDRESS;
  }

  options.from = uploadAccount;

  deployer.deploy(TUSD, options)
  .then(instance => {    
    tusd = instance;
    return tusd.balanceOf(uploadAccount);
  })  
  .then(balance => {
    console.log(`${uploadAccount} balance: ${balance}`);
  });
};