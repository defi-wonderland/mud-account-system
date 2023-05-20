// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter } from "../codegen/Tables.sol";

abstract contract AccountPermissionSystem is System {
  function createAccount() public returns (uint32) {
    
  }

  function linkAccount(address _account) public returns (bytes32 _accountId) {
    // recover signature
  }

}
