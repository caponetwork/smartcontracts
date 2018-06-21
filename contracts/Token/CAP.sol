pragma solidity ^0.4.9;

import "./UnlimitedAllowanceToken.sol";

contract CAP is UnlimitedAllowanceToken {
    function CAP() {
    	decimals = 18;
    	totalSupply = uint(10**27); // 1 billion tokens, 18 decimal places
    	name = "CAPO Dex Token";
    	symbol = "CAP";
    	balances[msg.sender] = totalSupply;
    }	
}


