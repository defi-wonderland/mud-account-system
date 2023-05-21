// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Account } from "./Account.sol";

interface IAccountFactory {
  function ownerAccounts(address _owner, uint256 _index) external view returns (address);
  function createAccount(address _owner) external returns (Account _account);
}

contract AccountFactory is IAccountFactory {

  mapping(address => address[]) public ownerAccounts;

  function createAccount(address _owner) public returns (Account _account) {
    _account = new Account(_owner);
    ownerAccounts[_owner].push(address(_account));
  }

}
