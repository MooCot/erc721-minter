// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC721MinterWithRoles is ERC721, AccessControl {
    // Роль MINTER
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Счётчик токенов
    uint256 private _tokenIdCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenIdCounter = 1;

        // Назначаем владельцу контракта роль администратора
         _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    // Переопределяем supportsInterface для устранения конфликта
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }


    /**
     * @dev Минтинг токенов доступен только для адресов с ролью MINTER.
     */
    function mint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _tokenIdCounter++;
    }

    function assignMinterRole(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }

    /**
     * @dev Отзыв роли MINTER_ROLE. Только администратор (владелец) может отзывать роли.
     */
    function revokeMinterRole(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, minter);
    }
}