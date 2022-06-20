import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

import { Signers } from "../util/types";

describe("RedPacketToken Test", function () {
  let RedPacketToken: any;
  let RedPacketTokenV2: any;
  let v1: any;
  let v2: any;
  const signers = {} as Signers;
  const transferAmount = "2.0";
  const amountEther = (amount: string) => {
    return ethers.utils.parseEther(amount);
  };

  before(async () => {
    RedPacketToken = await ethers.getContractFactory("RedPacketToken");
    RedPacketTokenV2 = await ethers.getContractFactory("RedPacketTokenV2");
  });

  it("version() v1", async function () {
    const [admin, user] = await ethers.getSigners();
    signers.admin = admin;
    signers.user = user;
    v1 = await upgrades.deployProxy(RedPacketToken, { kind: "uups" });
    expect(await v1.version()).to.equal("v1");
    console.log("-------------info----------------");
    console.log("name:", await v1.name());
    console.log("symbol:", await v1.symbol());
    console.log("totalSupply:", ethers.utils.formatEther((await v1.totalSupply()) + ""));
    console.log(
      "signers.admin",
      signers.admin.address,
      ethers.utils.formatEther(await v1.balanceOf(signers.admin.address)),
    );
    console.log("---------------------------------");
  });

  it("transfer() with v1", async function () {
    let balanceOf = await v1.balanceOf(signers.admin.address);
    await v1.transfer(signers.user.address, amountEther(transferAmount));
    balanceOf = await v1.balanceOf(signers.user.address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal(transferAmount);
  });

  it("version() v2", async function () {
    v2 = await upgrades.upgradeProxy(v1, RedPacketTokenV2);
    expect(await v2.version()).to.equal("v2");
  });

  it("balanceOf() with v2", async function () {
    const balanceOf = await v2.balanceOf(signers.user.address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal(transferAmount);
  });

  it("v2.mint() should be success", async function () {
    const mintAmount = "99999.0";
    v2.mint(signers.user.address, amountEther(mintAmount));
    const balanceOf = await v2.balanceOf(signers.user.address);
    expect(ethers.utils.formatEther(balanceOf.toString())).to.equal("100001.0"); //mintAmount+transferAmount
  });
  after(async () => {
    console.log("v1-totalSupply", ethers.utils.formatEther(await v1.totalSupply()));
    console.log("v2-totalSupply", ethers.utils.formatEther(await v2.totalSupply()));
    console.log(
      "v1-signers.admin",
      signers.admin.address,
      ethers.utils.formatEther(await v1.balanceOf(signers.admin.address)),
    );
    console.log(
      "v1-signers.user",
      signers.user.address,
      ethers.utils.formatEther(await v1.balanceOf(signers.user.address)),
    );
    console.log(
      "v2-signers.admin",
      signers.admin.address,
      ethers.utils.formatEther(await v2.balanceOf(signers.admin.address)),
    );
    console.log(
      "v2-signers.user",
      signers.user.address,
      ethers.utils.formatEther(await v2.balanceOf(signers.user.address)),
    );
  });
});
