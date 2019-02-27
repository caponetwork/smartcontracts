const BigNumber = require('bignumber.js');
const VND = artifacts.require('./Token/VND.sol');


contract('VND', function(accounts) {

    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];

    /// Test base features

    it('Should have correct decimals', function() {
        return VND.deployed()
        .then(function(instance) {
            return instance.decimals();
        })
        .then(function(decimals) {
            assert.equal(decimals, 0, 'decimals is not 0');
        });
    });


    it('Should have correct totalSupply', function() {
        return VND.deployed()
        .then(function(instance) {
            return instance.totalSupply();
        })
        .then(function(totalSupply) {
            assert.equal(totalSupply, 0, "totalSupply is not 0");
        });
    });


    it('Should have correct name', function() {
        return VND.deployed()
        .then(function(instance) {
            return instance.name();
        })
        .then(function(name) {
            assert.equal(name, "Vietnam Dong", "name is not Vietnam Dong");
        });
    });


    it('Should have correct symbol', function() {
        return VND.deployed()
        .then(function(instance) {
            return instance.symbol();
        })
        .then(function(symbol) {
            assert.equal(symbol, 'VND', "symbol is not VND");
        });
    });

    /// Test group feature of burn

    it('Should return false if burner has insufficient balance', async () => {
        const instance = await VND.new({from: owner});
        const result = await instance.burn(1000000, {from: owner})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, false, 'should return false');
    });

    
    if('Should burn correct balance', async () => {
        const instance = await VND.new({from: owner});
        await instance.mint(owner, 1000000, {from: owner});
        await instance.burn(500000, {from: owner});
        const balance = instance.balanceOf(owner);
        assert.equal(balance.eq(500000), true, 'balance should be 1000000');
    });


    it('Should return false if burner have insufficient allowed when execute burnFrom', async () => {
        const instance = await VND.new({from: owner});
        await instance.mint(user1, 1000000, {from: owner});
        await instance.approve(owner, 500000, {from: user1});
        const result = await instance.burnFrom(user1, 1000000, {from: owner})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, false, 'should return false');
    });


    it('Should sub correct allowed after execute burnFrom', async () => {
        const instance = await VND.new({from: owner});
        await instance.mint(user1, 1000000, {from: owner});
        await instance.approve(owner, 500000, {from: user1});
        await instance.burnFrom(user1, 200000, {from: owner});
        const allowance = await instance.allowance(user1, owner);
        assert.equal(allowance.eq(300000), true, 'allowance should be 300000'); 
    });


    it('Shoudl burn correct balance after execute burnFrom', async () => {
        const instance = await VND.new({from: owner});
        await instance.mint(user1, 1000000, {from: owner});
        await instance.approve(owner, 500000, {from: user1});
        await instance.burnFrom(user1, 200000, {from: owner});
        const balance = await instance.balanceOf(user1);
        assert.equal(balance.eq(800000), true, 'balance should be 800000');
    });

    /// Test group feature of mint

    it('Deployer should be a minter', function() {
        return VND.deployed()
        .then(function(instance) {
            return instance.isMinter(owner);
        })
        .then( isMinter => {
            assert.equal(isMinter, true, "Deployer is not a minter");
        });
    });


    // Add one address to be a minter
    // then verify this address should be a minter
    it('Minter can add new minter', async () => {
        const instance = await VND.deployed();
        const result = await instance.addMinter(user1, {from: owner})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, true, 'Minter cannot add new minter');

        const isMinter = await instance.isMinter(user1);
        assert.equal(isMinter, true, "User1 is not a minter");
    });


    it('Only Minter can new add minter', async () => {
        const instance = await VND.deployed();
        const result = await instance.addMinter(user3, {from: user2})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, false, 'should return false if sender is not a minter');
    });


    // Minter remove itselft successfully
    // then verify that minter is not minter anymore
    it('Minter can remove itselft', async () => {
        const instance = await VND.deployed();
        const result = await instance.renounceMinter({from: user1})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, true, 'should return true');

        const isMinter = await instance.isMinter(user1);
        assert.equal(isMinter, false, "User1 should not be a minter anymore");
    });


    it('Only minter can mint', async () => {
        const instance = await VND.deployed();
        let result = await instance.mint(user1, 1000000, {from: user1})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, false, 'user1 cannot mint');

        result = await instance.mint(user1, 1000000, {from: owner})
        .then(function(result) {
            if (result.logs.length > 0) {
                return true;
            }

            return false;
        })
        .catch(function(error) {
            return false;
        });

        assert.equal(result, true, 'should return true');
    });


    it('Should mint correct balance', async () => {
        const instance = await VND.new({from: owner});
        await instance.mint(user1, 1000000, {from: owner})
        const user1Balance = await instance.balanceOf(user1);
        assert.equal(user1Balance.eq(1000000), true, 'user1 balance should be 1000000');
    });

});