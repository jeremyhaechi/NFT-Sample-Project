// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

struct TokenMetadata {
    uint tokenID;
    address owner;
    string tokenURI;
}

contract NFT is Ownable, ERC721("OurNFT", "ONFT") {
    using Counters for Counters.Counter;

    Counters.Counter currentTokenID;
    mapping(uint256 => TokenMetadata) public metadataOwnership;

    event tokenMinted(address owner, address recipient, uint256 tokenID);
    event tokenBurned(address tokenOwner, uint256 tokenID);

    constructor() payable {
        
    }

    function mint(address recipient) onlyOwner external returns (bool) {
        // require(owner() != address(msg.sender), "Only owner can execute this minting function");
        _safeMint(recipient, currentTokenID.current());
        currentTokenID.increment();
        emit tokenMinted(msg.sender, recipient, currentTokenID.current());

        return true;
    }

    function burn(uint256 tokenID) onlyOwner external returns (bool) {
        TokenMetadata storage thisMetadata = metadataOwnership[tokenID];

        address tokenOwner = thisMetadata.owner;
        require(tokenOwner == address(msg.sender), "This is not your token, reverted");

        if (tokenOwner == address(msg.sender)) {
            _burn(tokenID);
            emit tokenBurned(tokenOwner, tokenID);
        }
        return true;
    }

    function tokenApprove(address to, uint256 tokenID) onlyOwner external {

    }

    function tokenTransfer(address from, address to, uint256 tokenID) external {

    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {

    }

    function reveal(uint256 tokenID) external returns (bool) {
        
    }
}