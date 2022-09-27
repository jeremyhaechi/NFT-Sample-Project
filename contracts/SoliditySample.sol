// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract SoliditySample {
    address public owner;
    constructor() payable {
        owner = msg.sender;
    }

    function test() external pure returns (uint256) {
        return 0x1234;
    }
}