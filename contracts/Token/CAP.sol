pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract CAP is ERC20, ERC20Detailed {

  uint256 public constant INITIAL_SUPPLY = 10**27;

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() public ERC20Detailed("CAPO Dex Token", "CAP", 18) {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

}