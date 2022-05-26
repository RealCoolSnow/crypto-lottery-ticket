import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Token Test", function () {
  let RedPacketToken: any;
  let RedPacketTokenV2: any;
  let v1: any;
  let v2: any;
  const transferAmount = "2.0";
  const amountEther = (amount: string) => {
    return ethers.utils.parseEther(amount);
  };

  before(async () => {
    RedPacketToken = await ethers.getContractFactory("RedPacketToken");
    RedPacketTokenV2 = await ethers.getContractFactory("RedPacketTokenV2");
  });

  it("version() v1", async function () {
    const [owner] = await ethers.getSigners();
    v1 = await upgrades.deployProxy(RedPacketToken, { kind: "uups" });
    expect(await v1.version()).to.equal("v1");
    console.log("-------------info----------------");
    console.log("name:", await v1.name());
    console.log("symbol:", await v1.symbol());
    console.log(
      "totalSupply:",
      ethers.utils.formatEther((await v1.totalSupply()) + "")
    );
    console.log("owner.address:", owner.address);
    console.log("---------------------------------");
  });

  it("transfer() with v1", async function () {
    const [owner, addr1] = await ethers.getSigners();
    let balanceOf = await v1.balanceOf(owner.address);
    await v1.transfer(addr1.address, amountEther(transferAmount));
    balanceOf = await v1.balanceOf(addr1.address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal(
      transferAmount
    );
  });

  it("version() v2", async function () {
    v2 = await upgrades.upgradeProxy(v1, RedPacketTokenV2);
    expect(await v2.version()).to.equal("v2");
  });

  it("balanceOf() with v2", async function () {
    const [, addr1] = await ethers.getSigners();
    const balanceOf = await v2.balanceOf(addr1.address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal(
      transferAmount
    );
  });
});
