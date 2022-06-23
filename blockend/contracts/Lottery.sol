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
    Counters.Counter private luckyCounter;
    address[] private players;

    constructor(uint256 _ticketPrice) {
        require(_ticketPrice > 0, "ticket price must be larger than 0");
        ticketPrice = _ticketPrice;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "ticket price is wrong");
        players.push(msg.sender);
        emit TicketBought(msg.sender, 1);
    }

    function openLucky() external onlyOwner returns (bool) {
        require(address(this).balance > 0, "total amount must be larger than 0");
        require(players.length > 0, "no player");
        uint256 index = random() % players.length;
        address luckUser = players[index];
        uint256 amount = address(this).balance;
        payable(luckUser).transfer(amount);
        players = new address[](0);
        luckyCounter.increment();
        emit LuckyOpened(luckUser, amount);
        return true;
    }

    function getLuckyCount() external view returns (uint256) {
        return luckyCounter.current();
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function version() external pure returns (string memory) {
        return "v1";
    }
}
