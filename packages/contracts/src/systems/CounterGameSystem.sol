// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { LimitCheckerSystem } from "./LimitCheckerSystem.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  CounterGame,
  CounterGameData
} from "../codegen/Tables.sol";
import {IAccount} from "../account/Account.sol";

contract CounterGameSystem is LimitCheckerSystem {

    uint16 constant FINAL_COUNT = 20;

    function checkAndUpdateLimit(uint256 _permissionId, IAccount.PermissionData calldata _permissionData)
      external
      returns (bool _isAllowed) {

    }
    
    function createGame(address _player1, address _player2) external returns (bytes32 _gameId) {
      _gameId = getUniqueEntity();
      CounterGame.set(_gameId, 
        CounterGameData({
          player1: _player1,
          player2: _player2,
          player1Consent: false,
          player2Consent: false,
          counter: 0,
          winner: address(0)
      }));
    }

    function acceptGame(bytes32 _gameId) external returns (bool _playerConsent) {
      CounterGameData memory _counterGameData = CounterGame.get(_gameId);
      if (_counterGameData.winner != address(0)) revert("Game is over");


      if(_msgSender() == _counterGameData.player1) {
        CounterGame.setPlayer1Consent(_gameId, true);
      } else if(_msgSender() == _counterGameData.player2) {
        CounterGame.setPlayer2Consent(_gameId, true);
      } else {
        //solint-disable-next-line
        revert("User is not participating in this game");
      }
    }

    function increment(bytes32 _gameId) external returns (bool _playerWon) {
      CounterGameData memory _counterGameData = CounterGame.get(_gameId);
      if (_counterGameData.winner != address(0)) revert("Game is over");
      if (!_counterGameData.player1Consent || !_counterGameData.player2Consent) revert("Both players must consent to play");

      if (_msgSender() != _counterGameData.player1 && _msgSender() != _counterGameData.player2) {
        revert("User is not participating in this game");
      }

      uint16 _counter = CounterGame.getCounter(_gameId);
      CounterGame.setCounter(_gameId, _counter);
      if (_counter == FINAL_COUNT) {
        _playerWon = true;
        CounterGame.setWinner(_gameId, _msgSender());
      }

    }


    
}
