//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IAccount} from "../account/Account.sol";

interface IAuthController {
    /**
     * @notice function that checks if the given permission data is authorized by the given auth data.
     * @param _permissionData The permission data.
     * @param _signature The signature.
     * @return _authorized True if the sender is authorized or not.
     */
    function auth(IAccount.PermissionData calldata _permissionData, bytes calldata _signature)
        external
        pure
        returns (bool _authorized);
}

contract AuthController is IAuthController {
    using ECDSA for bytes32;

    function auth(IAccount.PermissionData calldata _permissionData, bytes calldata _signature)
        external
        pure
        override
        returns (bool _authorized)
    {
        // Hash the permission data and nonce
        bytes32 _hash = keccak256(abi.encode(_permissionData));
        bytes32 _ethSignedMessageHash = ECDSA.toEthSignedMessageHash(_hash);

        // Get the signer with the given hash and signature
        address _signer = ECDSA.recover(_ethSignedMessageHash, _signature);

        // Check if the signer is the client
        _authorized = _signer == _permissionData.client;
    }
}
