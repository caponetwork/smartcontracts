pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token/Receiver_Interface.sol";
import './Token/CAP.sol';

contract CAPO is Ownable, RBAC, ContractReceiver {
	using SafeMath for uint256;

	string public constant ROLE_ADMIN = "admin";
	string public constant ROLE_HOLDER = "holder";
	string public constant ROLE_RELAYER = "relayer";		

	struct Invest {
		uint256 value; // current investing value of user		
		uint256 lastVestingTime; // last vesting time
	}
	mapping (address => Invest) investigations;
	
	uint public dayStart; //start investing date
	uint public dayEnd; // end investing date
	uint public rate; // number of token a user gets per wei
	uint256 public totalInvest = 0; // total token user park
	uint256 public totalWeiInvest = 0; // total wei user pay for token 

	// events
	event Park(address indexed _from, uint _amount, uint _time);
	event DirectPark(address indexed _from, uint _wei, uint _amount, uint _time);
	event UnPark(address indexed _to, bool relayer, uint _amount, uint _time);	
	event Collect(address indexed _to, uint _amount, uint _time);

	modifier onlyAdmin() {
		checkRole(msg.sender, ROLE_ADMIN);
		_;
	}

	modifier onlyHolder() {
		checkRole(msg.sender, ROLE_HOLDER);
		_;
	}

	modifier onlyRelayer() {
		checkRole(msg.sender, ROLE_RELAYER);
		_;
	}

	modifier inOpenTime() {
		require(dayStart <= block.timestamp && block.timestamp <= dayEnd);
		_;
	}

	constructor(uint _dayStart, uint _dayEnd, uint _rate) public {
		addRole(msg.sender, ROLE_ADMIN);
		dayStart = _dayStart;
		dayEnd = _dayEnd;		
		rate = _rate;
	}

/*Public getter functions */

	function vestingOf(address _owner) external view returns (uint256) {
		return investigations[_owner].value;
	}

	function lastVestingTimeOf(address _owner) external view returns (uint256) {
		return investigations[_owner].lastVestingTime;
	}

/* Admin functions */	

	function addAdmin(address _admin) external onlyOwner {
		addRole(_admin, ROLE_ADMIN);
	}

	function removeAdmin(address _admin) external onlyOwner {
		removeRole(_admin, ROLE_ADMIN);
	}

	function upgradeToRelayer(address _holder) public onlyAdmin {

	}

	function removeRelayer(address _relayer) public onlyAdmin {

	}

	function removeHolder(address _holder) public onlyAdmin {

	}

	/**
	 * @dev handle incomming token transfer transaction
	 */
	function tokenFallback(address _from, uint256 _value, bytes _data) external {
		CAP token = CAP(msg.sender);
		if (keccak256(token.symbol()) == keccak256('CAP')) {
			park(_from, _value, _data);
		} else {
			revert();
		}	
	}

	function park(address _from, uint256 _value, bytes _data) private inOpenTime {		
		
		Invest vesting = investigations[_from];
		vesting.value = vesting.value.add(_value);
		vesting.lastVestingTime = block.timestamp;

		// append total invest
		totalInvest = totalInvest.add(_value);

		// add holder role
		if (!hasRole(_from, ROLE_HOLDER) && !hasRole(_from, ROLE_RELAYER)) {
			addRole(_from, ROLE_HOLDER);
		}
	}

	function () payable {
		directPark(msg.sender, msg.value);
	}

	function directPark(address _from, uint _value) private {
		uint numberOfToken = _value.mul(rate);
		totalWeiInvest = totalWeiInvest.add(_value);
		bytes memory empty;
		park(_from, numberOfToken, empty);
	}

	function unPark(uint _amount) external onlyHolder inOpenTime {
		if (hasRole(msg.sender, ROLE_RELAYER)) {
			 
		} else if (hasRole(msg.sender, ROLE_HOLDER)) {
			holderUnPark(_amount);

		} else {
			revert();
		}
	}

	function holderUnPark(uint _amount) private inOpenTime {
		
	}

	function relayerUnPark(uint _amount) public onlyOwner inOpenTime {
		
	}

	function withdraw() external onlyHolder {
		
	}

	function collect(address _to, uint _amount) external onlyOwner {
		
	}	
}