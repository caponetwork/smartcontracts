
const CapoProxy = artifacts.require('./CapoProxy.sol');

contract('CapoProxy', function(accounts) {
  const owner = accounts[0];
  const tester1 = accounts[1];
  const tester2 = accounts[2];

  it('Should have correct authorities after creation time', function() {
    return CapoProxy.deployed()
    .then( proxy => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 9, 'Number of authorities is not 9');
    });
  });


  it('Only owner can add authorize address', function() {
    return CapoProxy.deployed()
    .then( proxy => {
      return proxy.addAuthorizedAddress(tester2, {from: tester1});
    })
    .then( receipt => {
      assert.isOk(false, 'Transaction must be reverted');
    })
    .catch( err => {
      assert.isOk(true, 'Transaction must be reverted');
    });
  });


  it('Only owner can remove authorize address', function() {
    return CapoProxy.deployed()
    .then( proxy => {
      return proxy.removeAuthorizedAddress('0x14a15be2d6594b0e681fc136627c46d4ed72b0c3', {from: tester1});
    })
    .then( receipt => {
      assert.isOk(false, 'Transaction must be reverted');
    })
    .catch( err => {
      assert.isOk(true, 'Transaction must be reverted');
    });
  });


  it('Only owner can remove authorize at index', function() {
    return CapoProxy.deployed()
    .then( proxy => {
      return proxy.removeAuthorizedAddressAtIndex(3, {from: tester1});
    })
    .then( receipt => {
      assert.isOk(false, 'Transaction must be reverted');
    })
    .catch( err => {
      assert.isOk(true, 'Transaction must be reverted');
    });
  });


  it('Should return true if owner add authorized address', function() {
    let proxy;
    return CapoProxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.addAuthorizedAddress(tester2);
    })
    .then( result => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 10, 'Number of authorities is not 10');
    });
  });


  it('Should return true if owner remove authorized address', function() {
    let proxy;
    return CapoProxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.removeAuthorizedAddress('0x14a15be2d6594b0e681fc136627c46d4ed72b0c3');
    })
    .then( result => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 9, 'Number of authorities is not 9');
    });
  });


  it('Should return true if owner remove authorized address at index', function() {
    let proxy;
    return CapoProxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.removeAuthorizedAddressAtIndex(
        '0x363b0fdfadc994bc67f69a5f0dd71b3afc84dc89',
        2
      );
    })
    .then( result => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 8, 'Number of authorities is not 8');
    });
  });
});