// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

struct PermissionData {
  IAuthController authController;
  address client;
  address world;
  address system;
//   bytes4 functionSig;  // Pretty sure we don't need these
//   bytes functionParams; // Pretty sure we don't need these
  ILimitChecker limitChecker;
  bytes limitData;
}

struct AuthData {
  bytes32 signature;
  bytes32 nonce;
}

interface IAuthController {
    function auth(PermissionData calldata _permissionData, AuthData calldata _authData) external returns (bool _authorized);
}

interface ILimitChecker {
    function check(uint256 _permissionId, PermissionData calldata _permissionData, bytes calldata _data) external;

}

contract Account {

    address public owner;
    
    uint256 private _permissionIdCounter;

    // permissionId => permissionData
    mapping(uint256 => PermissionData) public permissionData;


    constructor(address _owner) {
        owner = _owner;
    }

    // TODO: use Ownable for a better flow of pendingOwner and acceptOwnership
    function changeOwner(address _newOwner) external {
        require(msg.sender == owner, 'Account::changeOwner: only owner can change owner');
        owner = _newOwner;
    }



    function auth(PermissionData calldata _permissionData, AuthData calldata _authData) external returns (uint256 _permissionId) {
        bool _authorized = _permissionData.authController.auth(_permissionData, _authData);
        if (!_authorized) revert('Account::auth: invalid authorizarion');
        _permissionId = _permissionIdCounter++;
        permissionData[_permissionId] = _permissionData;
    }

    function revoke(uint256 _permissionId) external {
        require(msg.sender == owner, 'Account::revoke: only owner can revoke');
        delete permissionData[_permissionId];
    }


    function execute(uint256 _permissionId, bytes calldata _data) external returns (bytes memory _returnData) {
        PermissionData memory _permissionData = permissionData[_permissionId];
        require(_permissionData.client == msg.sender, 'Account::execute: invalid client');
        _permissionData.limitChecker.check(_permissionId, _permissionData, _data);
        
        bool _success;
        (_success, _returnData) = _permissionData.world.call(_data);
        if (!_success) revert('Account::execute: world call failed');
    }


}
