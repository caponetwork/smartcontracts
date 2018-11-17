pragma solidity ^0.4.9;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract TUSD is DetailedERC20, StandardToken {
    constructor() DetailedERC20("TrueUSD", "TUSD", 18) {    	
		totalSupply_ = 10**27; // 1 billion tokens, 18 decimal places
    	balances[msg.sender] = totalSupply_;
    }
}


