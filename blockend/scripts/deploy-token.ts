import { ethers, upgrades } from "hardhat";

async function main() {
  const RedPacketToken = await ethers.getContractFactory("RedPacketToken");
  const instance = await upgrades.deployProxy(RedPacketToken, { kind: "uups" });
  await instance.deployed();
  console.log("deployed, address: " + instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
