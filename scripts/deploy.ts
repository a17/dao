import { ethers } from "hardhat";

async function main() {
  // await hre.run('compile');
  const Treasure = await ethers.getContractFactory("Treasure");
  const tl = await Treasure.deploy(100, [], []);
  await tl.deployed();
  console.log("Treasure deployed to:", tl.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("DAOToken", "DAO");
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(
    token.address,
    tl.address,
    "DAO Governance",
    6800, // about 4 hours (blocktime: 2.1 sec)
    41100, // about 1 day
    ethers.utils.parseEther("1"), // 1 token
    1 // 1% of supply
  );
  await governance.deployed();
  console.log("Governance deployed to:", governance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
