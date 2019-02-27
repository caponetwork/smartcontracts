const CAPO = artifacts.require('./CAPO.sol')
			, CAP = artifacts.require('./Token/CAP.sol')
			, BigNumber = require('bignumber.js');

let capo
		, cap
		, uploadAccount				
		, current = new Date();

module.exports = (deployer, network, accounts) => {
	uploadAccount = accounts[0];
	
	let dayStart = current.getTime() / 1000;
	current.setDate(current.getDate() + 5);
	let dayEnd = current.getTime() /  1000;
	let rate = 1000; // 1 wie = 1000 cap ( not include decimal )

	deployer.deploy(CAPO, dayStart, dayEnd, rate, {from: uploadAccount})
    .then(async (instance) => {    
        capo = instance;
        console.log(`capo address: ${capo.address}`);

        let dayStart = await capo.dayStart();
        let dayEnd = await capo.dayEnd();
        let rate = await capo.rate();
        console.log(`dayStart: ${dayStart} \ndayEnd: ${dayEnd} \nrate: ${rate}`);    
    })
    .catch((err) => {
        console.log(err);
    });	
}