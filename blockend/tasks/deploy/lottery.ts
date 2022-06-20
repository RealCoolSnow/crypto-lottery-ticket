import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { Lottery, Lottery__factory } from "../../src/types";

task("deploy:Lottery")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const lotteryFactory: Lottery__factory = <Lottery__factory>await ethers.getContractFactory("Lottery");
    const lottery: Lottery = <Lottery>await lotteryFactory.connect(signers[0]).deploy(taskArguments.lottery);
    await lottery.deployed();
    console.log("Lottery deployed to: ", lottery.address);
  });
