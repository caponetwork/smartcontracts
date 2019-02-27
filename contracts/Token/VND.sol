pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";


contract VND is ERC20, ERC20Detailed, ERC20Burnable, ERC20Mintable {

  constructor() public ERC20Detailed("Vietnam Dong", "VND", 0) {}
}