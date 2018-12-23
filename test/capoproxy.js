
const CapoProxy = artifacts.require('./CapoProxy.sol');

contract('CapoProxy', function(accounts) {
  const owner = accounts[0];

  it('Should have correct authorities after creation time', function() {
    return CapoProxy.deployed()
    .then( instance => {
      return instance.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 9, 'Number of authorities is not 18');
    });
  });
});