const BigNumber = require('bignumber.js');
const VND = artifacts.require('./Token/VND.sol');


contract('VND', function(accounts) {

    const owner = accounts[0];
    const user1 = accounts[1];
    

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

});