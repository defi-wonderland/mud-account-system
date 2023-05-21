// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { LimitCheckerSystem } from "./LimitCheckerSystem.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  CounterGame,
  CounterGameData
} from "../codegen/Tables.sol";
import {IAccount} from "../account/Account.sol";

interface ICounterGameSystem {
  function createGame(address _player1, address _player2) external returns (bytes32 _gameId);
  function acceptGame(bytes32 _gameId) external returns (bool _playerConsent);
  function increment(bytes32 _gameId) external returns (bool _playerWon);
}

contract CounterGameSystem is LimitCheckerSystem {

    uint16 constant FINAL_COUNT = 20;

    mapping(uint256 => bool) public oneTimePermission;


    function getPermissionData(
      bytes calldata _data
    ) external view returns (bytes memory _limitData) {

      bytes4 _functionSignature = bytes4(_data);

      if (_functionSignature == ICounterGameSystem.createGame.selector) {
        _limitData = _data;
      } else if (_functionSignature == ICounterGameSystem.acceptGame.selector) {
        _limitData = _data;
      } else if (_functionSignature == ICounterGameSystem.increment.selector) {
        _limitData = _data; // _data = _functionSignature + _gameId
      } else {
        revert("CounterGameSystem::getPermissionData: unknown function");
      }
    }

    function checkAndUpdateLimit(
      uint256 _permissionId,
      IAccount.PermissionData calldata _permissionData,
      bytes calldata _data
    ) external returns (bool _allowed) {
      // grab first 4 bytes of limitData
      bytes4 _functionSignature = bytes4(_permissionData.limitData);
      // TODO: we assume that singnatures are unique, but we should check that :)

      if (_functionSignature == ICounterGameSystem.createGame.selector) {
        // check that _permissionId can only be executed once
        if (oneTimePermission[_permissionId]) revert("CounterGameSystem::checkAndUpdateLimit: permission already used");
        // on createGame we want the data to be exactly the same as the one we signed
        _allowed = keccak256(_permissionData.limitData) == keccak256(_data);
        if (!_allowed) revert("CounterGameSystem::checkAndUpdateLimit: not-authorized data");
        oneTimePermission[_permissionId] = true;

      } else if (_functionSignature == ICounterGameSystem.acceptGame.selector) {
        if (oneTimePermission[_permissionId]) revert("CounterGameSystem::checkAndUpdateLimit: permission already used");
        _allowed = keccak256(_permissionData.limitData) == keccak256(_data);
        if (!_allowed) revert("CounterGameSystem::checkAndUpdateLimit: not-authorized data");
        oneTimePermission[_permissionId] = true;

      } else if (_functionSignature == ICounterGameSystem.increment.selector) {
        // _data     = _functionSignature + _gameId + _message
        // limitData = _functionSignature + _gameId
        // Only validate _functionSignature + _gameId
        _allowed = keccak256(_permissionData.limitData) == keccak256(_data[:36]);
      } else {
        revert("CounterGameSystem::checkAndUpdateLimit: unknown function");
      }
    }
    
    function createGame(address _player1, address _player2) external returns (bytes32 _gameId) {
      _gameId = getUniqueEntity();
      if (_player1 == address(0) || _player2 == address(0)) revert("CounterGameSystem::createGame: invalid players");
      if (_player1 == _player2) revert("CounterGameSystem::createGame: players must be different");
      CounterGame.set(_gameId, 
        CounterGameData({
          player1: _player1,
          player2: _player2,
          player1Consent: false,
          player2Consent: false,
          counter: 0,
          winner: address(0),
          message: ""
      }));
    }

    function acceptGame(bytes32 _gameId) external returns (bool _playerConsent) {
      CounterGameData memory _counterGameData = CounterGame.get(_gameId);
      if (_counterGameData.winner != address(0)) revert("Game is over");

      if(_msgSender() == _counterGameData.player1) {
        if (_counterGameData.player1Consent) revert("Player 1 already consented");
        CounterGame.setPlayer1Consent(_gameId, true);
      } else if(_msgSender() == _counterGameData.player2) {
        if (_counterGameData.player2Consent) revert("Player 2 already consented");
        CounterGame.setPlayer2Consent(_gameId, true);
      } else {
        //solint-disable-next-line
        revert("User is not participating in this game");
      }
    }

    function increment(bytes32 _gameId, string calldata _message) external returns (bool _playerWon) {
    // function increment(bytes32 _gameId) external returns (bool _playerWon) {
      CounterGameData memory _counterGameData = CounterGame.get(_gameId);
      if (_counterGameData.winner != address(0)) revert("Game is over");
      if (!_counterGameData.player1Consent || !_counterGameData.player2Consent) revert("Both players must consent to play");

      if (_msgSender() != _counterGameData.player1 && _msgSender() != _counterGameData.player2) {
        revert("User is not participating in this game");
      }

      uint16 _counter = CounterGame.getCounter(_gameId) + 1;
      CounterGame.setCounter(_gameId, _counter);
      if (_counter == FINAL_COUNT) {
        _playerWon = true;
        CounterGame.setWinner(_gameId, _msgSender());
        CounterGame.setMessage(_gameId, _message);
      }
    }


    
}
