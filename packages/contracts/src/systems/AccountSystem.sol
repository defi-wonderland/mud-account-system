// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { IAccountFactory } from "../account/AccountFactory.sol";
import { IAccount } from "../account/Account.sol";
import { AuthController } from "../authController/AuthController.sol";
import {
  AccountFactorySingleton
} from "../codegen/Tables.sol";

contract AccountSystem is IAccount, System {

  address public ACCOUNT_FACTORY;
  address public AUTH_CONTROLLER;

  function setAccountFactory(address _accountFactory) public {
    require(ACCOUNT_FACTORY == address(0), "AccountSystem: already set");
    ACCOUNT_FACTORY = _accountFactory;
    AccountFactorySingleton.set(ACCOUNT_FACTORY);
    AUTH_CONTROLLER = address(new AuthController());
  }
  
  function createAccount() public returns (address _account) {
    return address(IAccountFactory(ACCOUNT_FACTORY).createAccount(_msgSender()));
  }

  function ownerAccounts(address _owner, uint256 _index) external view returns (address) {
    return IAccountFactory(ACCOUNT_FACTORY).ownerAccounts(_owner, _index);
  }

  function getAuthController() external view returns (address) {
    return AUTH_CONTROLLER;
  }

  function getAccountSystemAddress() external view returns (address _accountSystemAddress) {
    _accountSystemAddress = address(this);
  }


  function auth(IAccount.PermissionData calldata _permissionData, bytes calldata _signature)
        external
        returns (uint256 _permissionId) {
    revert('not implemented');
  }

  function execute(uint256 _permissionId, bytes calldata _data) external returns (bytes memory _returnData) {
    revert('not implemented');
  }

}
