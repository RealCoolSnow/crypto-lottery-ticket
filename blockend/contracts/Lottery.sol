// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/ILottery.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Lottery contract
/// @author coolsnow(coolsnow2020@gmail.com)
contract Lottery is ILottery, Ownable {
    using Counters for Counters.Counter;
    uint256 private immutable ticketPrice;
    uint256 private totalAmount;
    Counters.Counter private luckyCounter;

    constructor(uint256 _ticketPrice) {
        require(_ticketPrice > 0, "ticket price must be larger than 0");
        ticketPrice = _ticketPrice;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "ticket price is wrong");
        totalAmount += msg.value;
        emit TicketBought(msg.sender, totalAmount);
    }

    function openLucky() external onlyOwner returns (bool) {
        require(totalAmount > 0, "total amount must be larger than 0");
        luckyCounter.increment();
        address[] memory luckyUsers;
        emit LuckyOpened(0, 0, luckyUsers);
        return true;
    }

    function getLuckyCount() external view returns (uint256) {
        return luckyCounter.current();
    }

    function getTotalAmount() external view returns (uint256) {
        return totalAmount;
    }

    function version() external pure returns (string memory) {
        return "v1";
    }
}
