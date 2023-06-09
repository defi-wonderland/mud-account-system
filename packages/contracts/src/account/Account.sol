// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {IAuthController} from "../authController/AuthController.sol";
import {ILimitCheckerSystem} from "../systems/LimitCheckerSystem.sol";

interface IAccount {
    /**
     * @notice PermissionData is a struct that contains the permissions given from a sender to a client.
     * @param authController The address of the auth controller.
     * @param client The address of the client.
     * @param world The address of the world.
     * @param limitChecker The address of the limit checker.
     * @param limitData The limit data.
     */
    struct PermissionData {
        IAuthController authController;
        address client;
        address world;
        ILimitCheckerSystem limitChecker;
        bytes limitData;
    }

    /**
     * @notice function that authorizes a client to execute an action on behalf of the signer
     * @param _permissionData The permission data struct with the information of the underlying permission
     * @param _signature The signature obtained from the permission data hash sign
     */
    function auth(PermissionData calldata _permissionData, bytes calldata _signature)
        external
        returns (uint256 _permissionId);

    /**
     * @notice function that executes an action on behalf of the signer
     * @param _permissionId The permission id related to the given permission
     * @param _data The execution data and arguments
     */
    function execute(uint256 _permissionId, bytes calldata _data) external returns (bytes memory _returnData);

    /**
     * @notice function that revokes a permission
     * @param _permissionId The permission id related to the given permission
     */
    function revoke(uint256 _permissionId) external;
}

contract Account is IAccount {
    address public owner;

    uint256 private _permissionIdCounter;

    // permissionId => permissionData
    mapping(uint256 => PermissionData) public permissionData;

    constructor(address _owner) {
        owner = _owner;
    }

    // TODO: use Ownable for a better flow of pendingOwner and acceptOwnership
    function changeOwner(address _newOwner) external {
        require(msg.sender == owner, "Account::changeOwner: only owner can change owner");
        owner = _newOwner;
    }

    function auth(PermissionData calldata _permissionData, bytes calldata _signature)
        external
        returns (uint256 _permissionId)
    {
        bool _authorized = _permissionData.authController.auth(owner, _permissionData, _signature);
        if (!_authorized) revert("Account::auth: invalid authorizarion");
        _permissionIdCounter = _permissionIdCounter + 1;
        _permissionId = _permissionIdCounter;
        permissionData[_permissionId] = _permissionData;
    }

    function revoke(uint256 _permissionId) external {
        require(msg.sender == owner, "Account::revoke: only owner can revoke");
        delete permissionData[_permissionId];
    }

    function execute(uint256 _permissionId, bytes calldata _data) external returns (bytes memory _returnData) {
        PermissionData memory _permissionData = permissionData[_permissionId];
        require(_permissionData.client == msg.sender, "Account::execute: invalid client");
        bool _allowed = _permissionData.limitChecker.checkAndUpdateLimit(_permissionId, _permissionData, _data);
        if (!_allowed) revert("Account::execute: not allowed");

        bool _success;
        (_success, _returnData) = _permissionData.world.call(_data);
        if (!_success) revert("Account::execute: world call failed");
    }
}
