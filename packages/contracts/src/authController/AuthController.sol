//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IAccount} from "../account/Account.sol";

interface IAuthController {
    /**
     * @notice function that checks if the given permission data is authorized by the given auth data.
     * @param _accountOwner The address of the owner of the account contract
     * @param _permissionData The permission data struct
     * @param _signature The signature obtained from the permission data hash sign
     * @return _authorized True if the sender is authorized or not by the signer
     */
    function auth(address _accountOwner, IAccount.PermissionData calldata _permissionData, bytes calldata _signature)
        external
        pure
        returns (bool _authorized);

    /**
     * @notice function that returns the hash of the given permission data
     * @param _permissionData The permission data struct
     * @return _permissionDataHash The hash of the permission data
     */
    function getPermissionDataHash(IAccount.PermissionData calldata _permissionData)
        external
        pure
        returns (bytes32 _permissionDataHash);
}

contract AuthController is IAuthController {
    using ECDSA for bytes32;

    function auth(address _accountOwner, IAccount.PermissionData calldata _permissionData, bytes calldata _signature)
        external
        pure
        override
        returns (bool _authorized)
    {
        // Hash the permission data
        bytes32 _hash = keccak256(abi.encode(_permissionData));
        bytes memory s = bytes(Strings.toHexString(uint256(_hash), 32));
        _hash = ECDSA.toEthSignedMessageHash(s);

        // Get the signer with the given hash and signature
        address _signer = ECDSA.recover(_hash, _signature);

        // If the signer is not the _accountOwner, then it is not authorized
        _authorized = _signer == _accountOwner;
    }

    function getPermissionDataHash(IAccount.PermissionData calldata _permissionData)
        external
        pure
        override
        returns (bytes32 _permissionDataHash)
    {
        _permissionDataHash = keccak256(abi.encode(_permissionData));
    }

    function getPermissionDataHash(IAccount.PermissionData calldata _permissionData)
        external
        view
        override
        returns (bytes32 _permissionDataHash)
    {
        _permissionDataHash = keccak256(abi.encode(_permissionData));
    }
}
