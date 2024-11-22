import { ethers } from "hardhat";

async function main() {
    const ERC721MinterWithRoles = await ethers.getContractFactory("ERC721MinterWithRoles");
    const erc721Minter = await ERC721MinterWithRoles.deploy("MyNFT", "MNFT");

    await erc721Minter.waitForDeployment();

    console.log("ERC721MinterWithRoles deployed to:", erc721Minter.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});