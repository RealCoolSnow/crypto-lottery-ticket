// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IRedPacket {
    function makePacket() external payable returns (uint256);
}

struct Packet {
    uint256 amount;
    string code;
}

contract RedPacket is Ownable, IRedPacket {
    using Counters for Counters.Counter;
    Counters.Counter private _packetIds;
    mapping(address => mapping(uint256 => Packet)) public packetMap;

    function makePacket() external payable returns (uint256) {
        require(msg.value > 0, "Amount should be greater than 0");
        uint256 packetId = pickRandomPacketId();
        packetMap[msg.sender][packetId] = Packet(msg.value, "");
        _packetIds.increment();
        return packetId;
    }

    function pickRandomPacketId() private view returns (uint256) {
        uint256 newItemId = _packetIds.current();
        return random(string(abi.encodePacked(block.timestamp, Strings.toString(newItemId), msg.sender)));
    }

    function random(string memory input) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
}
