pragma solidity ^0.4.9;

import "./UnlimitedAllowanceToken.sol";

contract CAP is UnlimitedAllowanceToken {
    constructor() DetailedERC20("CAPO Dex Token", "CAP", 18) {    	
		totalSupply_ = 10**27; // 1 billion tokens, 18 decimal places
    	balances[msg.sender] = totalSupply_;
    }	
}


