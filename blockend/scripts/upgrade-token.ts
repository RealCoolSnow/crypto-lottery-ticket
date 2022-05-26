import { ethers, upgrades } from "hardhat";
async function main() {
  const RedPacketTokenV1 = await ethers.getContractFactory("RedPacketToken");
  const RedPacketTokenV2 = await ethers.getContractFactory("RedPacketTokenV2");
  const instance = await upgrades.deployProxy(RedPacketTokenV1, {
    kind: "uups",
  });
  await instance.deployed();
  await upgrades.upgradeProxy(instance, RedPacketTokenV2);
  console.log(instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
