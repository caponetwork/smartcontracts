pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract CapoProxy is Ownable {
	using SafeMath for uint256;
	
  struct Order {
		address makerAddress;           // Address that created the order.      
		address takerAddress;           // Address that is allowed to fill the order. If set to 0, any address is allowed to fill the order.          
		address feeRecipientAddress;    // Address that will recieve fees when order is filled.      
		address senderAddress;          // Address that is allowed to call Exchange contract methods that affect this order. If set to 0, any address is allowed to call these methods.
		uint256 makerAssetAmount;       // Amount of makerAsset being offered by maker. Must be greater than 0.        
		uint256 takerAssetAmount;       // Amount of takerAsset being bid on by maker. Must be greater than 0.        
		uint256 makerFee;               // Amount of ZRX paid to feeRecipient by maker when order is filled. If set to 0, no transfer of ZRX from maker to feeRecipient will be attempted.
		uint256 takerFee;               // Amount of ZRX paid to feeRecipient by taker when order is filled. If set to 0, no transfer of ZRX from taker to feeRecipient will be attempted.
		uint256 expirationTimeSeconds;  // Timestamp in seconds at which order expires.          
		uint256 salt;                   // Arbitrary number to facilitate uniqueness of the order's hash.     
		bytes makerAssetData;           // Encoded data that can be decoded by a specified proxy contract when transferring makerAsset. The last byte references the id of this proxy.
		bytes takerAssetData;           // Encoded data that can be decoded by a specified proxy contract when transferring takerAsset. The last byte references the id of this proxy.
  }

	/// @dev Address is authorized or not
	mapping (address => bool) public authorized;

	/// @dev list authorized addresses
	address[] public authorities;

  mapping (address => uint256) public totalWithdraws;
	
	/// @dev Contructure function
	constructor(address[] initializeAuthorities) public {
		addAuthorizedAddress(msg.sender);

    uint authorityLength = initializeAuthorities.length;
    for (uint i=0; i<authorityLength; i++) {
      address authority = initializeAuthorities[i];
      addAuthorizedAddress(authority);
    }
	}

/* Events */

	// Event logged when a new address is authorized.
	event AuthorizedAddressAdded(
			address indexed target,
			address indexed caller
	);

	// Event logged when a currently authorized address is unauthorized.
	event AuthorizedAddressRemoved(
		address indexed target,
		address indexed caller
	);

	// Event logged when onwer withdraw token
	event WithDraw(
    address indexed asset,
		address indexed to,
		uint256 amount
	);

/** Modifier */

	/// @dev Only authorized addresses can invoke functions with this modifier.
	modifier onlyAuthorized {
		require(
			authorized[msg.sender],
			"SENDER_NOT_AUTHORIZED"
		);
		_;
	}

	/// @dev Only order's maker addresses can invoke functions with this modifier.
	modifier onlyMaker(address maker) {
		require(
			maker == msg.sender, 
			"SENDER_IS_NOT_MARKER"
		);
		_;
	}

/** Owner functions */

	/// @dev Withdraw amount of asset to address
	/// @param to Receiver address
	/// @param amount number of tokens will be transfered
	function withdraw(address asset, address to, uint256 amount) public onlyOwner {
		string memory functionSignature = 'transfer(address, uint256)';
		bytes memory encodedDatas = abi.encodeWithSelector(bytes4(keccak256(functionSignature)), to, amount);
		require(asset.call(encodedDatas));

		// append total withdraw amount
    uint256 totalWithdraw = totalWithdraws[asset];
    uint256 newTotalWithdraw = totalWithdraw.add(amount);
    totalWithdraws[asset] = newTotalWithdraw;
		emit WithDraw(asset, to, amount);
	}

	/// @dev Get total amount of weth was withdrew
	/// @return total amount
	function getTotalWithdraw(address asset) public onlyOwner returns (uint256) {
		return totalWithdraws[asset];
	}

/** Authorized functions */
	
	/// @dev Authorizes an address.
	/// @param target Address to authorize.
	function addAuthorizedAddress(address target) public onlyOwner {
		require(
				!authorized[target],
				"TARGET_ALREADY_AUTHORIZED"
		);

		authorized[target] = true;
		authorities.push(target);
		emit AuthorizedAddressAdded(target, msg.sender);
	}

	/// @dev Removes authorizion of an address.
	/// @param target Address to remove authorization from.
	function removeAuthorizedAddress(address target) external onlyOwner {
		require(
				authorized[target],
				"TARGET_NOT_AUTHORIZED"
		);

		delete authorized[target];
		for (uint256 i = 0; i < authorities.length; i++) {
				if (authorities[i] == target) {
						authorities[i] = authorities[authorities.length - 1];
						authorities.length -= 1;
						break;
				}
		}
		emit AuthorizedAddressRemoved(target, msg.sender);
	}

	/// @dev Removes authorizion of an address.
	/// @param target Address to remove authorization from.
	/// @param index Index of target in authorities array.
	function removeAuthorizedAddressAtIndex(
		address target, 
		uint256 index
	) external onlyOwner {
		require(
				authorized[target],
				"TARGET_NOT_AUTHORIZED"
		);
		require(
				index < authorities.length,
				"INDEX_OUT_OF_BOUNDS"
		);
		require(
				authorities[index] == target,
				"AUTHORIZED_ADDRESS_MISMATCH"
		);

		delete authorized[target];
		authorities[index] = authorities[authorities.length - 1];
		authorities.length -= 1;
		emit AuthorizedAddressRemoved(target, msg.sender);
	}

	/// @dev Gets all authorized addresses.
	/// @return Array of authorized addresses.
	function getAuthorizedAddresses() external view returns (address[] memory) {
		return authorities;
	}

/** 0x function */

	/// @dev Send executed transaction to exchange
	/// @param exchangeAddress Exchange smartcontract address
	/// @param salt Arbitrary number to ensure uniqueness of transaction hash.
	/// @param signerAddress Address of transaction signer.
	/// @param data AbiV2 encoded calldata.
	/// @param signature Proof of signer transaction by signer.
	function executeTransaction(
		address exchangeAddress,
			uint256 salt,
			address signerAddress,
			bytes data,
			bytes signature
	) public {
		string memory functionSignature = 'executeTransaction(uint256,address,bytes,bytes)';
		bytes memory encodedDatas = abi.encodeWithSelector(bytes4(keccak256(functionSignature)), salt, signerAddress, data,signature);
		require(exchangeAddress.call(encodedDatas));
	}

	/// @dev Match two order. Only authorized msg.sender accepted
	/// @param exchangeAddress Exchange smartcontract address
	/// @param leftOrderAddresses First order's makerAddress, takerAddress, feeRecipientAddress, senderAddress
	/// @param leftOrderValues First order's makerAssetAmount, takerAssetAmount, makerFee, takerFee, expirationTimeSeconds, salt
	/// @param leftOrderDatas First order's makerAssetData, takerAssetData
	/// @param rightOrderAddresses Second order's makerAddress, takerAddress, feeRecipientAddress, senderAddress
	/// @param rightOrderValues Second order's makerAssetAmount, takerAssetAmount, makerFee, takerFee, expirationTimeSeconds, salt
	/// @param rightOrderDatas Second order's makerAssetData, takerAssetData
	/// @param leftSignature Proof that order was created by the left maker.
  /// @param rightSignature Proof that order was created by the right maker.
	function matchOrders(
		address exchangeAddress,
		address[4] leftOrderAddresses,
		uint256[6] leftOrderValues, 
		bytes[2] leftOrderDatas, 
		address[4] rightOrderAddresses, 
		uint256[6] rightOrderValues, 
		bytes[2] rightOrderDatas, 
		bytes memory leftSignature,
		bytes memory rightSignature
  ) public onlyAuthorized
	{
		Order memory leftOrder = Order(
			leftOrderAddresses[0],
			leftOrderAddresses[1],
			leftOrderAddresses[2],
			leftOrderAddresses[3],
			leftOrderValues[0],
			leftOrderValues[1],
			leftOrderValues[2],
			leftOrderValues[3],
			leftOrderValues[4],
			leftOrderValues[5],
			leftOrderDatas[0],
			leftOrderDatas[1]
		);

		Order memory rightOrder = Order(
			rightOrderAddresses[0],
			rightOrderAddresses[1],
			rightOrderAddresses[2],
			rightOrderAddresses[3],
			rightOrderValues[0],
			rightOrderValues[1],
			rightOrderValues[2],
			rightOrderValues[3],
			rightOrderValues[4],
			rightOrderValues[5],
			rightOrderDatas[0],
			rightOrderDatas[1]
		);
		string memory functionSignature = "matchOrders((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes),(address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes),bytes,bytes)";
		bytes memory encodedDatas = abi.encodeWithSelector(bytes4(keccak256(functionSignature)), leftOrder,rightOrder,leftSignature,rightSignature);
		require(exchangeAddress.call(encodedDatas));
	}
}