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

    function checkAndUpdateLimit(uint256 _permissionId, IAccount.PermissionData calldata _permissionData)
      external
      returns (bool _isAllowed) {

    }

    function checkGamer(address _gamer) private returns(uint8 _playerId) {
      if(CounterGameSystem.getPlayer1() == _gamer) {
        _playerId = 1;
      } else if(CounterGameSystem.getPlayer2() == _gamer) {
        _playerId = 2;
      }
      // else {
      //   _playerId = 0;
      // }
    }
    
    function createGame(address _player1, address _player2) external returns (bytes32 _gameId) {
      _gameId = getUniqueEntity();
      CounterGame.set(_gameId, 
        CounterGameData({
          player1: _player1,
          player2: _player2,
          player0Consent: false,
          player1Consent: false,
          counter: 0,
          winner: address(0)
      }));
    }

    function acceptGame(bytes32 _gameId) external returns (bool _playerConsent) {
      uint8 _playerId = checkGamer(_msgSender());
      if(_playerId == 1) {
        CounterGame.setPlayer1Consent(_gameId, true);
      } else if(_playerId == 2) {
        CounterGame.setPlayer2Consent(_gameId, true);
      } else {
        //solint-disable-next-line
        revert("User is not participating in this game");
      }
    }

    function move(bytes32 _gameId) external returns (bool _playerConsent) {
      uint8 _playerId = checkGamer(_msgSender());
      if(_playerId == 0) {
        revert("User is not participating in this game");
      }
      
      CounterGame.setCounter(CounterGame.getCounter() + 1);



    }


    
}
