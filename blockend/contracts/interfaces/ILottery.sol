// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ILottery {
    /// @notice base info
    function version() external pure returns (string memory);

    /// @notice buy one ticket, 0.001ETH
    function buyTicket() external payable;

    /// @notice open lucky
    function openLucky() external returns (bool);

    /// @notice get total lucky count
    function getLuckyCount() external returns (uint256);

    /// ---event---
    /// @notice event emitted when buy one ticket
    event TicketBought(address indexed owner, uint256 totalAmountInPool);

    /// @notice event emitted where lucky time executed
    event LuckyOpened(address luckyUser, uint256 amount);
}
