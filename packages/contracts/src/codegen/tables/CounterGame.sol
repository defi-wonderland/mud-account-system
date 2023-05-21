// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("CounterGame")));
bytes32 constant CounterGameTableId = _tableId;

struct CounterGameData {
  address player1;
  address player2;
  address winner;
  bool player1Consent;
  bool player2Consent;
  uint16 counter;
}

library CounterGame {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](6);
    _schema[0] = SchemaType.ADDRESS;
    _schema[1] = SchemaType.ADDRESS;
    _schema[2] = SchemaType.ADDRESS;
    _schema[3] = SchemaType.BOOL;
    _schema[4] = SchemaType.BOOL;
    _schema[5] = SchemaType.UINT16;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](6);
    _fieldNames[0] = "player1";
    _fieldNames[1] = "player2";
    _fieldNames[2] = "winner";
    _fieldNames[3] = "player1Consent";
    _fieldNames[4] = "player2Consent";
    _fieldNames[5] = "counter";
    return ("CounterGame", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get player1 */
  function getPlayer1(bytes32 key) internal view returns (address player1) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Get player1 (using the specified store) */
  function getPlayer1(IStore _store, bytes32 key) internal view returns (address player1) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Set player1 */
  function setPlayer1(bytes32 key, address player1) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((player1)));
  }

  /** Set player1 (using the specified store) */
  function setPlayer1(IStore _store, bytes32 key, address player1) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((player1)));
  }

  /** Get player2 */
  function getPlayer2(bytes32 key) internal view returns (address player2) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Get player2 (using the specified store) */
  function getPlayer2(IStore _store, bytes32 key) internal view returns (address player2) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Set player2 */
  function setPlayer2(bytes32 key, address player2) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((player2)));
  }

  /** Set player2 (using the specified store) */
  function setPlayer2(IStore _store, bytes32 key, address player2) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((player2)));
  }

  /** Get winner */
  function getWinner(bytes32 key) internal view returns (address winner) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2);
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Get winner (using the specified store) */
  function getWinner(IStore _store, bytes32 key) internal view returns (address winner) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2);
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Set winner */
  function setWinner(bytes32 key, address winner) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((winner)));
  }

  /** Set winner (using the specified store) */
  function setWinner(IStore _store, bytes32 key, address winner) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((winner)));
  }

  /** Get player1Consent */
  function getPlayer1Consent(bytes32 key) internal view returns (bool player1Consent) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Get player1Consent (using the specified store) */
  function getPlayer1Consent(IStore _store, bytes32 key) internal view returns (bool player1Consent) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Set player1Consent */
  function setPlayer1Consent(bytes32 key, bool player1Consent) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked((player1Consent)));
  }

  /** Set player1Consent (using the specified store) */
  function setPlayer1Consent(IStore _store, bytes32 key, bool player1Consent) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked((player1Consent)));
  }

  /** Get player2Consent */
  function getPlayer2Consent(bytes32 key) internal view returns (bool player2Consent) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 4);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Get player2Consent (using the specified store) */
  function getPlayer2Consent(IStore _store, bytes32 key) internal view returns (bool player2Consent) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 4);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Set player2Consent */
  function setPlayer2Consent(bytes32 key, bool player2Consent) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 4, abi.encodePacked((player2Consent)));
  }

  /** Set player2Consent (using the specified store) */
  function setPlayer2Consent(IStore _store, bytes32 key, bool player2Consent) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 4, abi.encodePacked((player2Consent)));
  }

  /** Get counter */
  function getCounter(bytes32 key) internal view returns (uint16 counter) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 5);
    return (uint16(Bytes.slice2(_blob, 0)));
  }

  /** Get counter (using the specified store) */
  function getCounter(IStore _store, bytes32 key) internal view returns (uint16 counter) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 5);
    return (uint16(Bytes.slice2(_blob, 0)));
  }

  /** Set counter */
  function setCounter(bytes32 key, uint16 counter) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 5, abi.encodePacked((counter)));
  }

  /** Set counter (using the specified store) */
  function setCounter(IStore _store, bytes32 key, uint16 counter) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 5, abi.encodePacked((counter)));
  }

  /** Get the full data */
  function get(bytes32 key) internal view returns (CounterGameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, bytes32 key) internal view returns (CounterGameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(
    bytes32 key,
    address player1,
    address player2,
    address winner,
    bool player1Consent,
    bool player2Consent,
    uint16 counter
  ) internal {
    bytes memory _data = encode(player1, player2, winner, player1Consent, player2Consent, counter);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    bytes32 key,
    address player1,
    address player2,
    address winner,
    bool player1Consent,
    bool player2Consent,
    uint16 counter
  ) internal {
    bytes memory _data = encode(player1, player2, winner, player1Consent, player2Consent, counter);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 key, CounterGameData memory _table) internal {
    set(
      key,
      _table.player1,
      _table.player2,
      _table.winner,
      _table.player1Consent,
      _table.player2Consent,
      _table.counter
    );
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, bytes32 key, CounterGameData memory _table) internal {
    set(
      _store,
      key,
      _table.player1,
      _table.player2,
      _table.winner,
      _table.player1Consent,
      _table.player2Consent,
      _table.counter
    );
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (CounterGameData memory _table) {
    _table.player1 = (address(Bytes.slice20(_blob, 0)));

    _table.player2 = (address(Bytes.slice20(_blob, 20)));

    _table.winner = (address(Bytes.slice20(_blob, 40)));

    _table.player1Consent = (_toBool(uint8(Bytes.slice1(_blob, 60))));

    _table.player2Consent = (_toBool(uint8(Bytes.slice1(_blob, 61))));

    _table.counter = (uint16(Bytes.slice2(_blob, 62)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    address player1,
    address player2,
    address winner,
    bool player1Consent,
    bool player2Consent,
    uint16 counter
  ) internal view returns (bytes memory) {
    return abi.encodePacked(player1, player2, winner, player1Consent, player2Consent, counter);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}

function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}
