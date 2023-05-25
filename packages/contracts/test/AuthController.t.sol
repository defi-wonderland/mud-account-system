// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Test} from "forge-std/Test.sol";
import {AuthController, IAuthController} from "../src/authController/AuthController.sol";
import {CounterGame, CounterGameTableId, CounterGameData} from "../src/codegen/Tables.sol";
import {ICounterGameSystem} from "../src/systems/CounterGameSystem.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {IAccount} from "../src/account/Account.sol";
import {ILimitCheckerSystem} from "../src/systems/LimitCheckerSystem.sol";

contract Base is Test {
    AuthController public authController;
    address public user = address(1);

    function setUp() public {
        authController = new AuthController();
    }
}

contract CounterGameSystemTest is Base {
    function testGetPermissionData() public {
        IAccount.PermissionData memory _permissionData = IAccount.PermissionData({
            authController: IAuthController(address(0xE91bfd2AfA045Ab2f47BEf565FC1deb7511D1AC6)),
            client: address(0xe673c19a81886260BCc77d009A7b9E20BaFF1917),
            world: address(0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B),
            limitChecker: ILimitCheckerSystem(address(0x1c85638e118b37167e9298c2268758e058DdfDA0)),
            limitData: hex"a6f979ff0000000000000000000000008421d6d2253d3f8e25586aa6692b1bf591da377900000000000000000000000063aa51e2808be96ed022b07836ad5fa097806f29"
        });

        bytes32 _permissionDataHash = authController.getPermissionDataHash(_permissionData);
        bytes32 _hash = keccak256(abi.encode(_permissionData));

        assertEq(_permissionDataHash, _hash);
    }

    function testAuth() public {
        // Hardcode a real permission data with its signature
        IAccount.PermissionData memory _permissionData = IAccount.PermissionData({
            authController: IAuthController(address(0xE91bfd2AfA045Ab2f47BEf565FC1deb7511D1AC6)),
            client: address(0xe673c19a81886260BCc77d009A7b9E20BaFF1917),
            world: address(0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B),
            limitChecker: ILimitCheckerSystem(address(0x1c85638e118b37167e9298c2268758e058DdfDA0)),
            limitData: hex"a6f979ff0000000000000000000000008421d6d2253d3f8e25586aa6692b1bf591da377900000000000000000000000063aa51e2808be96ed022b07836ad5fa097806f29"
        });
        bytes memory _signature =
            hex"a4fc18db70d2777b8bfa2b0492a86c6b3bbc428338fe4edcfad7d37ad710f2930ae6e699f0c4a72c211b1a3d4dfb7b5f32008f0599993e8171354e42714ad81b1b";

        // Check that the sender is authorized by the signer
        // TODO(ds): prank the signer when we have it
        bool _authorized = authController.auth(user, _permissionData, _signature);
        assertEq(_authorized, true);
    }
}
