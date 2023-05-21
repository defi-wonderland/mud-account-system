//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {System} from "@latticexyz/world/src/System.sol";

interface ILimitChecker {
    /**
     * @notice PermissionData is a struct that contains the permissions given from a sender to a client.
     * @param authController The address of the auth controller.
     * @param client The address of the client.
     * @param world The address of the world.
     * @param system The address of the system.
     * @param functionSig The function signature of the function to be called.
     * @param functionParams The function parameters of the function to be called.
     * @param limitChecker The address of the limit checker.
     * @param limitData The limit data.
     */
    struct PermissionData {
        address authController;
        address client;
        address world;
        address system;
        address limitChecker;
        bytes limitData;
    }

    /**
     * @notice Checks if the permission is allowed, and updates the last state of it.
     * @dev It has to check if the permission is allowed, comparing it with the limitData defined.
     * @param _permissionId The permission id.
     * @param _permissionData The permission data.
     * @return _isAllowed True if the permission is allowed.
     */
    function checkAndUpdateLimit(uint256 _permissionId, PermissionData calldata _permissionData)
        external
        returns (bool _isAllowed);
}

/**
 * @title LimitChecker
 * @author Wonderland
 * @dev Contracts will inherit this contract to implement their limits.
 * @dev Each function should contain its own limit data.
 * @dev Each function should contain getter with the defined params returning `PermissionData`
 */
abstract contract LimitCheckerSystem is System, ILimitChecker {
    /**
     * @notice It saves the limit data state for a permission id.
     * @dev permissionId => limitData
     */
    mapping(uint256 => bytes) public permissionIdLimitData;
}
