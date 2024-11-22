import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721MinterWithRoles } from "../typechain-types";

describe("ERC721MinterWithRoles", function () {
    let contract: ERC721MinterWithRoles;

    before(async function () {
        const factory = await ethers.getContractFactory("ERC721MinterWithRoles");
        contract = (await factory.deploy("MyNFT", "MNFT")) as ERC721MinterWithRoles;
        await contract.waitForDeployment();
    });

    it("Should assign MINTER_ROLE by owner", async function () {
        const [owner, minter] = await ethers.getSigners();

        // Назначение MINTER_ROLE
        await contract.connect(owner).assignMinterRole(minter.address);

        // Проверяем, что роль присвоена
        expect(await contract.hasRole(await contract.MINTER_ROLE(), minter.address)).to.be.true;
    });

    it("Should not allow non-owner to assign MINTER_ROLE", async function () {
        const [_, nonOwner, minter] = await ethers.getSigners();
        // Пытаемся назначить MINTER_ROLE не владельцем
        await expect(
            contract.connect(nonOwner).assignMinterRole(minter.address)
        ).to.be.revertedWithCustomError(contract, "AccessControlUnauthorizedAccount")
        .withArgs(nonOwner.address, await contract.DEFAULT_ADMIN_ROLE());
    });

    it("Should allow minter to mint tokens", async function () {
        const [_, minter, user] = await ethers.getSigners();

        // Минтер минтит токен
        await contract.connect(minter).mint(user.address);

        // Проверяем владельца токена
        expect(await contract.ownerOf(1)).to.equal(user.address);
    });

    it("Should not allow owner to mint tokens", async function () {
        const [owner, , user] = await ethers.getSigners();
    
        // Проверяем, что транзакция отклоняется с кастомной ошибкой
        await expect(
            contract.connect(owner).mint(user.address)
        ).to.be.revertedWithCustomError(contract, "AccessControlUnauthorizedAccount")
            .withArgs(owner.address, await contract.MINTER_ROLE());
    });
});