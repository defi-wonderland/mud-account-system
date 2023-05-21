// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Account } from "./Account.sol";

interface IAccountFactory {
  function createAccount(address _owner) external returns (Account _account);
}

contract AccountFactory is IAccountFactory {

  function createAccount(address _owner) public returns (Account _account) {
    return new Account(_owner);
  }

}
