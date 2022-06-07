// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

interface IRedPacket {
    function makePacket(string memory code) external payable returns (uint256);

    event PacketMaked(address user, uint256 hash);
}

struct Packet {
    uint256 amount;
    string code;
}

contract RedPacket is Ownable, IRedPacket {
    using Counters for Counters.Counter;
    Counters.Counter private _packetIds;
    mapping(address => mapping(uint256 => Packet)) public packetMap;

    function makePacket(string memory code) external payable returns (uint256 packetId) {
        require(msg.value > 0, "Amount should be greater than 0");
        packetId = pickRandomPacketId();
        packetMap[msg.sender][packetId] = Packet(msg.value, code);
        _packetIds.increment();
        emit PacketMaked(msg.sender, packetId);
        // console.log("makePacket", packetId, code);
    }

    function pickRandomPacketId() private view returns (uint256) {
        uint256 newItemId = _packetIds.current();
        return random(string(abi.encodePacked(block.timestamp, Strings.toString(newItemId), msg.sender)));
    }

    function random(string memory input) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
}
