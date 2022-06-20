// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ILottery {
    /// @notice base info
    function version() external pure returns (string memory);

    /// @notice buy one ticket, 0.001ETH
    function buyTicket() external payable;

    /// @notice event emitted when buy one ticket
    event TicketNew(address indexed owner, uint256 ticketAddress);
}
