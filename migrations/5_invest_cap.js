const CAPO = artifacts.require('./CAPO.sol')
			, CAP = artifacts.require('./Token/CAP.sol')
			, BigNumber = require('bignumber.js');

let capo
		, cap		
		, fundedAccount
		, user1
		, user2
		, user3;

const transferCap = async (to, amount, from) => {
	const options = {
		from: from
	}
	return cap.transfer(
		to, 
		amount, 
		options);
}

const sendEth = async (from, amount) => {
	return capo.sendTransaction({
		from: from, 
		value: amount
	});
}

module.exports = async (deployer, network, accounts) => {
	uploadAccount = accounts[0];
	fundedAccount = accounts[1];
	user1 = accounts[2];
	user2 = accounts[3];
	user3 = accounts[4];

	capo = await CAPO.deployed();
	cap = await CAP.deployed();

	let amounts = [
		(new BigNumber(10**18)).times(5).toNumber(),
		(new BigNumber(10**18)).times(7).toNumber(),
		(new BigNumber(10**18)).times(0.1).toNumber(),
		(new BigNumber(10**18)).times(0.2).toNumber(),
	];

	Promise.all([
		transferCap(capo.address, amounts[0], fundedAccount),
		transferCap(capo.address, amounts[1], user1),		
		sendEth(user2, amounts[2]),
		sendEth(user3, amounts[3]),
	])
	.then( async ()=> {
		let totalInvest = await capo.totalInvest();
		let totalWeiInvest = await capo.totalWeiInvest();
		console.log(`totalInvest: ${totalInvest} \ntotalWeiInvest ${totalWeiInvest}`);

		return Promise.all([
			capo.vestingOf(fundedAccount),
			capo.vestingOf(user1),
			capo.vestingOf(user2),
			capo.vestingOf(user3),
		]);
	})
	.then((vestings) => {
		console.log(`
		${fundedAccount}, vesting: ${vestings[0]}
		${user1}, vesting: ${vestings[1]}
		${user2}, vesting: ${vestings[2]}
		${user3}, vesting: ${vestings[3]}
		`);

		return Promise.all([
			capo.lastVestingTimeOf(fundedAccount),
			capo.lastVestingTimeOf(user1),
			capo.lastVestingTimeOf(user2),
			capo.lastVestingTimeOf(user3),
		]);		
	})
	.then((vestingTimes) => {
		console.log(`
		${fundedAccount}, vestingTime: ${vestingTimes[0]}
		${user1}, vestingTime: ${vestingTimes[1]}
		${user2}, vestingTime: ${vestingTimes[2]}
		${user3}, vestingTime: ${vestingTimes[3]}
		`);
	})
	.catch((err) => {
		console.log(err);
	});	
}