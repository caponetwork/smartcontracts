
const BigNumber = require('bignumber.js');
var CAP = artifacts.require('./Token/CAP.sol');


contract('CAP', function(accounts) {
	const owner = accounts[0];
	const user1 = accounts[1];
	const user2 = accounts[2];
	const user3 = accounts[2];

	// var cap;
	// beforeEach('setup contract for each test', async function () {
 //      	cap = await CAP.new({from: owner});
 //    });

	it('Should have correct decimals', function() {
		return CAP.deployed()
		.then(function(instance) {
	      	return instance.decimals();
	    })
	    .then(function(decimals) {
	      	
	    });
	});

	it('Should have correct totalSupply', function() {
		return CAP.deployed()
		.then(function(instance) {
	      	return instance.totalSupply();
	    })
	    .then(function(totalSupply) {
	      	assert.equal(totalSupply, 10**27, "totalSupply is not 10**27");
	    });
	});

	it('Should have correct name', function() {
		return CAP.deployed()
		.then(function(instance) {
	      	return instance.name();
	    })
	    .then(function(name) {
	      	assert.equal(name, "CAPO Dex Token", "name is not CAPO Dex Token");
	    });
	});

	it('Should have correct symbol', function() {
		return CAP.deployed()
		.then(function(instance) {
	      	return instance.symbol();
	    })
	    .then(function(symbol) {
	      	assert.equal(symbol, 'CAP', "symbol is not CAP");
	    });
	});

	it('Should initialize owner balance to totalSupply', function() {
		return CAP.deployed()
		.then(function(instance) {
	      	return Promise.all([instance.balanceOf(owner), instance.totalSupply()]);
	    })
	    .then(function(results) {	    	
	    	const balance = results[0].toNumber();
	    	const totalSupply = results[1].toNumber();
	      	assert.equal(balance, totalSupply, "owner's balance is not equal totalSupply");
	    });
	});

	it('Should transfer balance from sender to receiver', async () => {
		let instance = await CAP.deployed();
		const ownerBalance = await instance.balanceOf(owner);
		const receiverBalance = await instance.balanceOf(user1);
		const amountToTransfer = new BigNumber(10**18);
		const expectedOwnerBalance = ownerBalance.minus(amountToTransfer).toNumber();
		const expectedReceiverBalance = receiverBalance.plus(amountToTransfer).toNumber();
		await instance.transfer(user1, amountToTransfer.toNumber());
		const finalOwnerBalance = (await instance.balanceOf(owner)).toNumber();
		const finalReceiverBalance = (await instance.balanceOf(user1)).toNumber();
		assert.equal(expectedOwnerBalance, finalOwnerBalance, "owner's balance is not equal to expected balance");
		assert.equal(expectedReceiverBalance, finalReceiverBalance, "owner's balance is not equal to expected balance");
	});

	it('Should return true on a 0 value transfer', async () => {
		let instance = await CAP.deployed();
		const result = await instance.transfer(user1, 0, {from: owner});
		assert.equal(result.logs[0].args.value.toNumber(), 0, 'value is not 0');
	});

	it('Should return false if owner has insufficient balance', async () => {
		let instance = await CAP.deployed();
		const ownerBalance = await instance.balanceOf(owner);		
		const amountToTransfer = ownerBalance.plus(10**18).toNumber();		
		await instance.approve(user1, amountToTransfer, {from: owner});
		const result = await instance.transferFrom(owner, user1, amountToTransfer, {from: owner})
		.then(function(result) {
			if (result.logs.length > 0) {
				return true
			}
			return false;
		})
		.catch(function(error) {			
			return false;
		});		
		assert.equal(result, false, 'Should return false if owner has insufficient balance');
	});

	it('Should return false if spender has insufficient balance', async () => {
		let instance = await CAP.new({from: owner});
		const ownerBalance = await instance.balanceOf(owner);
		const user1Allowance = await instance.allowance(owner, user1);
		assert.equal(user1Allowance.comparedTo(ownerBalance) < 0, true, 'allowance must be less than owner balance');
		
		const amountToTransfer = ownerBalance.toNumber();		
		const result = await instance.transferFrom(owner, user1, amountToTransfer, {from: user1})
		.then(function(result) {
			if (result.logs.length > 0) {
				return true
			}
			return false;
		})
		.catch(function(error) {			
			return false;
		});		
		assert.equal(result, false, 'Should return false if spender has insufficient balance');
	});

	it('should return true on a 0 value transfer', async () => {
		let instance = await CAP.deployed();		
		const amountToTransfer = new BigNumber(0)
		const result = await instance.transferFrom(owner, user1, amountToTransfer.toNumber(), {from: user1})
		.then(function(result) {
			if (result.logs.length > 0) {
				return true
			}
			return false;
		})
		.catch(function(error) {			
			return false;
		});		
		assert.equal(result, true, 'should return true on a 0 value transfer');
	});
});