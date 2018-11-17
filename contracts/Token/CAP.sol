pragma solidity ^0.4.9;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract CAP is DetailedERC20, StandardToken {
    constructor() DetailedERC20("CAPO Dex Token", "CAP", 18) {    	
		totalSupply_ = 10**27; // 1 billion tokens, 18 decimal places
    	balances[msg.sender] = totalSupply_;
    }
}

