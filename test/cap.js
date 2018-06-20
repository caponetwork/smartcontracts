var CAP = artifacts.require('./Token/CAP.sol');

contract('CAP', function(accounts) {
	it('Should have correct decimals', function() {
		return CAP.deployed().then(function(instance) {
	      	return instance.decimals();
	    }).then(function(decimals) {
	      	assert.equal(decimals, 18, "decimals is not 18");
	    });
	});

	it('Should have correct totalSupply', function() {
		return CAP.deployed().then(function(instance) {
	      	return instance.totalSupply();
	    }).then(function(totalSupply) {
	      	assert.equal(totalSupply, 10**27, "totalSupply is not 10**27");
	    });
	});

	it('Should have correct name', function() {
		return CAP.deployed().then(function(instance) {
	      	return instance.name();
	    }).then(function(name) {
	      	assert.equal(name, "CAPO Dex Token", "name is not CAPO Dex Token");
	    });
	});

	it('Should have correct symbol', function() {
		return CAP.deployed().then(function(instance) {
	      	return instance.symbol();
	    }).then(function(symbol) {
	      	assert.equal(symbol, 'CAP', "symbol is not CAP");
	    });
	});

	it('Should initialize owner balance to totalSupply', function() {
		return CAP.deployed().then(function(instance) {
	      	return Promise.all([instance.balanceOf(accounts[0]), instance.totalSupply()]);
	    }).then(function(results) {
	    	const balance = results[0].toNumber();
	    	const totalSupply = results[1].toNumber();	    	
	      	assert.equal(balance, totalSupply, "owner's balance is not equal totalSupply");
	    });
	});

});