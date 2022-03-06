import { expect } from "chai";
import { ethers } from "hardhat";
import { Governance, Token, Treasure } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Governance", function () {
  let tl: Treasure;
  let gov: Governance;
  let token: Token;
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  const votingDelay = 6800; // about 4 hours (blocktime: 2.1 sec)
  const timelockDelay = 100;
  const votingPeriod = 41100; // about 1 day

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    tl = await (
      await ethers.getContractFactory("Treasure")
    ).deploy(timelockDelay, [], []);
    await tl.deployed();

    token = await (
      await ethers.getContractFactory("Token")
    ).deploy("DAOToken", "DAO");
    await token.deployed();

    gov = await (
      await ethers.getContractFactory("Governance")
    ).deploy(
      token.address,
      tl.address,
      "DAO Governance",
      votingDelay,
      votingPeriod,
      ethers.utils.parseEther("1"), // 1 token
      1 // 1% of supply
    );
    await gov.deployed();

    // grant timelock proposer and executor roles to governance
    await tl.grantRole(ethers.utils.id("PROPOSER_ROLE"), gov.address);
    await tl.grantRole(ethers.utils.id("EXECUTOR_ROLE"), gov.address);
  });

  it("Mint tokens by governance", async function () {
    await token.mint(user1.address, ethers.utils.parseEther("900"));
    await token.mint(user2.address, ethers.utils.parseEther("1000"));
    await token.connect(user1).delegate(user1.address);
    await token.connect(user2).delegate(user2.address);

    await token.transferOwnership(tl.address);

    const proposalDesc = "Proposal #1: Mint 1m tokens to treasure";
    const grantAmount = ethers.utils.parseEther("100000");

    // https://docs.openzeppelin.com/contracts/4.x/governance
    const calldata = token.interface.encodeFunctionData("mint", [
      tl.address,
      grantAmount,
    ]);

    await expect(
      gov.propose([token.address], [0], [calldata], proposalDesc)
    ).to.be.revertedWith(
      "GovernorCompatibilityBravo: proposer votes below proposal threshold"
    );

    await gov
      .connect(user1)
      .propose([token.address], [0], [calldata], proposalDesc);

    const proposalId = await gov.hashProposal(
      [token.address],
      [0],
      [calldata],
      ethers.utils.id(proposalDesc)
    );

    // proposal in Pending state
    expect(await gov.state(proposalId)).to.eq(0);

    // cant cast vote while pending
    await expect(gov.castVote(proposalId, 0)).to.be.revertedWith(
      "Governor: vote not currently active"
    );

    // mine blocks
    for (let i = 0; i < votingDelay; i++) {
      await ethers.provider.send("evm_mine", []);
    }

    // proposal in Active state
    expect(await gov.state(proposalId)).to.eq(1);

    // cast vote For
    await gov.connect(user2).castVote(proposalId, 1)

    // mine blocks
    for (let i = 0; i < votingPeriod; i++) {
      await ethers.provider.send("evm_mine", []);
    }

    // proposal in Succeed state
    expect(await gov.state(proposalId)).to.eq(4);

    // queue proposal to timelock
    await gov.queue([token.address], [0], [calldata], ethers.utils.id(proposalDesc))

    // proposal in Queued state
    expect(await gov.state(proposalId)).to.eq(5);

    // try to execute
    await expect(
      gov.execute(
        [token.address],
        [0],
        [calldata],
        ethers.utils.id(proposalDesc)
      )
    ).to.be.revertedWith("TimelockController: operation is not ready");

    // mine blocks
    for (let i = 0; i < timelockDelay; i++) {
      await ethers.provider.send("evm_mine", []);
    }

    // execute proposal
    await gov.execute(
      [token.address],
      [0],
      [calldata],
      ethers.utils.id(proposalDesc)
    );

    // proposal in Executed state
    expect(await gov.state(proposalId)).to.eq(7);

    await ethers.provider.send("evm_mine", []);

    expect(await token.balanceOf(tl.address)).to.eq(
      ethers.utils.parseEther("100000")
    );
  });
});
