// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RedPacketToken.sol";

/// @custom:security-contact coolsnow2020@gmail.com
contract RedPacketTokenV2 is RedPacketToken {
    function version() public pure override returns (string memory) {
        return "v2";
    }
}
