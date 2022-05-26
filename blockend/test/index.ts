import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Token Test", function () {
  let RedPacketToken: any;
  let RedPacketTokenV2: any;
  let v1: any;
  let v2: any;
  let accounts: any;

  before(async () => {
    RedPacketToken = await ethers.getContractFactory("RedPacketToken");
    RedPacketTokenV2 = await ethers.getContractFactory("RedPacketTokenV2");
  });

  it("version() v1", async function () {
    accounts = await ethers.getSigners();
    v1 = await upgrades.deployProxy(RedPacketToken, { kind: "uups" });
    expect(await v1.version()).to.equal("v1");
    console.log("name:" + (await v1.name()));
    console.log("symbol:" + (await v1.symbol()));
    console.log("totalSupply:" + (await v1.totalSupply()));
  });

  it("transfer() with v1", async function () {
    const amountEther = (amount: string) => {
      return ethers.utils.parseEther(amount);
    };
    const transferAmount = 10000;
    await v1.transfer(accounts[1].address, amountEther(transferAmount + ""));
    const balanceOf = await v1.balanceOf(accounts[0].address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal(
      1000000000 - transferAmount + ""
    );
  });

  it("version() v2", async function () {
    v2 = await upgrades.upgradeProxy(v1, RedPacketTokenV2);
    expect(await v2.version()).to.equal("v2");
  });

  it("balanceOf() with v2", async function () {
    const balanceOf = await v2.balanceOf(accounts[1].address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal("1.0");
  });
});
