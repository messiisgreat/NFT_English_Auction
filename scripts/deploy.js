// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // const ERC721 = await hre.ethers.getContractFactory("ERC721");
  // const erc721 = await ERC721.deploy();
  //
  // await erc721.deployed();
  //
  // console.log("contract erc721 deployed to:", erc721.address);

  const erc721Address = "0x0dda8257e55a008f273711da507e12f4d77164b3";

  const EnglishAuction = await hre.ethers.getContractFactory("EnglishAuction");
  const englishAuction = await EnglishAuction.deploy(erc721Address, 88, 1);

  await englishAuction.deployed();

  console.log("contract englishAuction deployed to:", englishAuction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
