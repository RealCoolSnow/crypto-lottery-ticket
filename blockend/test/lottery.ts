import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import { Artifact } from "hardhat/types";

import { Lottery } from "../src/types";
import { Signers } from "./util/types";

describe("Lottery test", function () {
  const ticketPrice = "0.0001";
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
    const lotteryArtifact: Artifact = await artifacts.readArtifact("Lottery");
    this.lottery = <Lottery>(
      await waffle.deployContract(this.signers.admin, lotteryArtifact, [ethers.utils.parseEther(ticketPrice)])
    );
  });

  it("base info", async function () {
    const version = await this.lottery.version();
    expect(version).to.equal("v1");
  });

  it("buy ticket", async function () {
    const overrides = { value: ethers.utils.parseEther(ticketPrice) };
    await expect(this.lottery.connect(this.signers.user).buyTicket( overrides)).to.emit(this.lottery, "TicketNew");
  });
});
