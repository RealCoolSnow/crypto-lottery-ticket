// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract SuchPet is ERC721Enumerable {
    constructor() ERC721("Such Pet", "SuchPet") {}

    function mint(address to, uint256 quantity) public {
        _safeMint(to, quantity);
    }
}
