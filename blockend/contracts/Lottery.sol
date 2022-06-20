// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/ILottery.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Lottery contract
/// @author coolsnow(coolsnow2020@gmail.com)
contract Lottery is ILottery, Ownable {
    uint256 public immutable ticketPrice;

    constructor(uint256 _ticketPrice) {
        require(_ticketPrice > 0, "ticket price must be larger than 0");
        ticketPrice = _ticketPrice;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "ticket price is wrong");
        emit TicketNew(msg.sender, uint256(1));
    }

    function version() external pure returns (string memory) {
        return "v1";
    }
}
