pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract CAP is ERC20, ERC20Detailed {

  uint256 public constant INITIAL_SUPPLY = 10**27; 

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor(address[] fundingAddresses, uint256[] fundingBalances) public ERC20Detailed("Capo Network", "CAP", 18) {
    require(fundingAddresses.length == fundingBalances.length);
    uint256 totalFunded = 0;
    for (uint i=0; i<fundingAddresses.length; i++) {
      address _address = fundingAddresses[i];
      uint256 balance = fundingBalances[i];
      _mint(_address, balance);
      totalFunded = totalFunded.add(balance);
    }

    _mint(msg.sender, INITIAL_SUPPLY.sub(totalFunded));
  }

}