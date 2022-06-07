import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Contract } from "ethers";
import { artifacts, ethers, waffle } from "hardhat";
import { Artifact } from "hardhat/types";

import { RedPacket } from "../src/types";
import { Signers } from "./types";

const formatETH = (wei: BigNumberish) => ethers.utils.formatEther(wei);

describe("RedPacket tests", function () {
  const signers = {} as Signers;
  let contract: Contract;

  const printInfo = async () => {
    const provider = waffle.provider;
    console.log("signers.admin", signers.admin.address, formatETH(await signers.admin.getBalance()));
    console.log("signers.user", signers.user.address, formatETH(await signers.user.getBalance()));
    console.log("contract", contract.address, formatETH(await provider.getBalance(contract.address)));
  };
  before(async function () {
    const s: SignerWithAddress[] = await ethers.getSigners();
    signers.admin = s[0];
    signers.user = s[1];
    //deploy
    const redPacketArtifact: Artifact = await artifacts.readArtifact("RedPacket");
    contract = <RedPacket>await waffle.deployContract(signers.admin, redPacketArtifact);
    console.log("--------------before------------------");
    await printInfo();
  });

  after(async function () {
    console.log("--------------after------------------");
    await printInfo();
  });

  it("owner()", async function () {
    expect(await contract.connect(signers.admin).owner()).to.eql(signers.admin.address);
    expect(await contract.connect(signers.user).owner()).to.eql(signers.admin.address);
  });

  it("genPacket(0.1) should be true", async function () {
    const ret = await contract.connect(signers.user).makePacket({
      value: ethers.utils.parseEther("0.1"),
    });
    console.log("ret-1", ret);
    // expect(ret).to.equal(1);
  });

  it("genPacket(0) should be reverted", async function () {
    await expect(
      await contract.connect(signers.user).makePacket({
        value: ethers.utils.parseEther("0"),
      }),
    ).to.be.revertedWith("Amount should be greater than 0");
  });
});
