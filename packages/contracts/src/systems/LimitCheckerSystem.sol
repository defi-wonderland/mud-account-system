//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {System} from "@latticexyz/world/src/System.sol";
import {IAccount} from "../account/Account.sol";

interface ILimitCheckerSystem {
    /**
     * @notice Checks if the permission is allowed, and updates the last state of it.
     * @dev It has to check if the permission is allowed, comparing it with the limitData defined.
     * @param _permissionId The permission id.
     * @param _permissionData The permission data.
     * @return _allowed True if the permission is allowed.
     */
    function checkAndUpdateLimit(
        uint256 _permissionId,
        IAccount.PermissionData calldata _permissionData,
        bytes memory _data
    ) external returns (bool _allowed);

    /**
     * @notice It returns the limit data for a given permission id
     * @param _data The function data
     * @return _limitData The limit for the given data
     */
    function getLimitData(bytes calldata _data) external view returns (bytes memory _limitData);

}

/**
 * @title LimitCheckerSystem
 * @author Wonderland
 * @dev Contracts will inherit this contract to implement their limits.
 * @dev Each function should contain its own limit data.
 * @dev Each function should contain getter with the defined params returning `IAccount.PermissionData`
 */
abstract contract LimitCheckerSystem is System, ILimitCheckerSystem {
    /**
     * @notice It saves the limit data state for a permission id.
     * @dev permissionId => limitData
     */
    mapping(uint256 => bytes) public permissionIdLimitData;
}
