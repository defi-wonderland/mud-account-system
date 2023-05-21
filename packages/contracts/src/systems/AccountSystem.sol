// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter } from "../codegen/Tables.sol";
import { IAccountFactory } from "../account/AccountFactory.sol";

contract AccountSystem is System {

  address public ACCOUNT_FACTORY;

  function setAccountFactory(address _accountFactory) public {
    require(ACCOUNT_FACTORY == address(0), "AccountSystem: already set");
    ACCOUNT_FACTORY = _accountFactory;
  }
  
  function createAccount() public returns (address _account) {
    return address(IAccountFactory(ACCOUNT_FACTORY).createAccount(_msgSender()));
  }

}
