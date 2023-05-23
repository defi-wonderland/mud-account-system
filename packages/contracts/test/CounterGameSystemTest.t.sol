// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0;

// import "forge-std/Test.sol";
// import {MudV2Test} from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
// import {getKeysWithValue} from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

// import {IWorld} from "../src/codegen/world/IWorld.sol";
// import {CounterGame, CounterGameTableId, CounterGameData} from "../src/codegen/Tables.sol";
// import {ICounterGameSystem} from "../src/systems/CounterGameSystem.sol";
// import {IAccount} from "../src/account/Account.sol";
// import {IAuthController} from "../src/authController/AuthController.sol";
// import {ILimitCheckerSystem} from "../src/systems/LimitCheckerSystem.sol";

// contract CounterGameSystemTest is MudV2Test {
//     using CounterGame for bytes;

//     IWorld public world;
//     address public accountOne = address(0x001);
//     address public accountTwo = address(0x002);

//     function setUp() public override {
//         super.setUp();
//         world = IWorld(worldAddress);
//     }

//     function testWorldExists() public {
//         uint256 codeSize;
//         address addr = worldAddress;
//         assembly {
//             codeSize := extcodesize(addr)
//         }
//         assertTrue(codeSize > 0);
//     }

//     function testGetPermissionData() public {
//         bytes4 _functionSig = (ICounterGameSystem.createGame.selector);
//         bytes memory _data = abi.encode(_functionSig, accountOne, accountTwo);
//         bytes memory _limitData = world.getPermissionData(_data);

//         assertEq(_limitData, _data);
//     }

//     function testCheckAndUpdateLimitSuccess() public {
//         // Get rule data
//         bytes4 _functionSig = (ICounterGameSystem.createGame.selector);
//         bytes memory _data = abi.encode(_functionSig, accountOne, accountTwo);
//         bytes memory _limitData = world.getPermissionData(_data);

//         uint256 _permissionId = 1;

//         // prepare permision data
//         IAccount.PermissionData memory _permissionData = IAccount.PermissionData({
//             authController: IAuthController(address(1)),
//             client: address(2),
//             world: address(3),
//             system: address(4),
//             limitChecker: ILimitCheckerSystem(address(5)),
//             limitData: _limitData
//         });

//         // check limit
//         bool _isAllowed = world.checkAndUpdateLimit(_permissionId, _permissionData, _limitData);
//         assertTrue(_isAllowed);
//     }

//     function testCheckAndUpdateLimitRevertsWithoutPermission() public {
//         // Get rule data
//         bytes4 _functionSig = (ICounterGameSystem.createGame.selector);
//         bytes memory _data = abi.encode(_functionSig, accountOne, accountTwo);
//         bytes memory _limitData = world.getPermissionData(_data);

//         uint256 _permissionId = 1;

//         // prepare permision data
//         IAccount.PermissionData memory _permissionData = IAccount.PermissionData({
//             authController: IAuthController(address(1)),
//             client: address(2),
//             world: address(3),
//             system: address(4),
//             limitChecker: ILimitCheckerSystem(address(5)),
//             limitData: _limitData
//         });

//         // check limit
//         world.checkAndUpdateLimit(_permissionId, _permissionData, _limitData);

//         vm.expectRevert();
//         world.checkAndUpdateLimit(_permissionId, _permissionData, _limitData);
//     }

//     function testIncrementSucceeds() public {
//         // Define vars
//         uint256 _permissionId = 1;

//         // Get rule data
//         bytes4 _functionSig = (ICounterGameSystem.createGame.selector);
//         bytes memory _data = abi.encode(_functionSig, accountOne, accountTwo);
//         bytes memory _limitData = world.getPermissionData(_data);

//         // Create game
//         bytes32 _gameId = world.createGame(accountOne, accountTwo);

//         // Accept game user one
//         _functionSig = (ICounterGameSystem.acceptGame.selector);
//         _data = abi.encode(_functionSig);
//         _limitData = world.getPermissionData(_data);

//         // prepare permision data
//         IAccount.PermissionData memory _permissionData = IAccount.PermissionData({
//             authController: IAuthController(address(20)),
//             client: address(20),
//             world: address(3),
//             system: address(4),
//             limitChecker: ILimitCheckerSystem(address(5)),
//             limitData: _limitData
//         });

//         // Update permission id
//         ++_permissionId;
//         // Check and update limit
//         world.checkAndUpdateLimit(_permissionId, _permissionData, _limitData);

//         // Exec user one accept game
//         vm.prank(accountOne);
//         world.acceptGame(_gameId);

//         // Accept game user two
//         _permissionData = IAccount.PermissionData({
//             authController: IAuthController(address(10)),
//             client: address(20),
//             world: address(3),
//             system: address(4),
//             limitChecker: ILimitCheckerSystem(address(5)),
//             limitData: _limitData
//         });

//         ++_permissionId;
//         world.checkAndUpdateLimit(_permissionId, _permissionData, _limitData);

//         vm.prank(accountTwo);
//         world.acceptGame(_gameId);

//         // increment
//         vm.prank(accountOne);
//         bool _playerWon = world.increment(_gameId, "someMsg");

//         // Check win is false
//         assertFalse(_playerWon);
//     }
// }
