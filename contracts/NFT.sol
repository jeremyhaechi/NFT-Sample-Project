// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

struct TokenMetadata {
    uint tokenID;
    address owner;
    string base;
    string tokenURI;
    bool isRevealed;
}

contract NFT is Ownable, ERC721("OurNFT", "ONFT") {
    using Counters for Counters.Counter;

    string defaultURI;
    uint256 timeoutDeadline;

    Counters.Counter currentTokenID;
    mapping(uint256 => TokenMetadata) public metadataOwnership;
    mapping(address => uint256) public balances;

    event tokenMinted(address owner, address recipient, uint256 tokenID);
    event tokenBurned(address tokenOwner, uint256 tokenID);

    constructor(string memory _defaultURI) payable {
        defaultURI = _defaultURI;
        // Deadline duration : 7 days
        timeoutDeadline = uint256(block.timestamp + 7 days);
    }

    function mint(address recipient) external returns (bool) {
        // Token minting limitation
        if (currentTokenID.current() >= 100000) {
            return false;
        }
        // require(owner() != address(msg.sender), "Only owner can execute this minting function");
        _safeMint(recipient, currentTokenID.current());
        currentTokenID.increment();

        balances[recipient] += 1;
        emit tokenMinted(msg.sender, recipient, currentTokenID.current());

        return true;
    }

    function burn(uint256 tokenID) external returns (bool) {
        TokenMetadata storage thisMetadata = metadataOwnership[tokenID];

        address tokenOwner = thisMetadata.owner;
        require(tokenOwner == address(msg.sender), "This is not your token, reverted");

        if (tokenOwner == address(msg.sender)) {
            _burn(tokenID);
            balances[tokenOwner] -= 1;          // Warning : Underflow
            emit tokenBurned(tokenOwner, tokenID);
        }
        return true;
    }

    function tokenApprove(address to, uint256 tokenID) onlyOwner external {
        _approve(to, tokenID);
    }

    function tokenTransfer(address from, address to, uint256 tokenID) external {
        TokenMetadata storage metaData = metadataOwnership[tokenID];

        require(_isApprovedOrOwner(msg.sender, tokenID) && metaData.owner == address(from), "This token is not from user");
        _transfer(from, to, tokenID);
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        TokenMetadata storage metaData = metadataOwnership[tokenId];
        string memory privateURI = metaData.tokenURI;

        if (!metaData.isRevealed) {
            return string(abi.encodePacked(defaultURI, "/", privateURI));
        }
        else {
            return string(abi.encodePacked(metaData.base, "/", privateURI));
        }
    }

    function reveal(uint256 tokenID, string memory revealedURI) external returns (bool) {
        require(currentTokenID.current() >= 10000 || block.timestamp >= timeoutDeadline, "Can't reveal yet");
        
        TokenMetadata storage metaData = metadataOwnership[tokenID];
        metaData.isRevealed = true;
        metaData.base = revealedURI;

        return true;
    }
}