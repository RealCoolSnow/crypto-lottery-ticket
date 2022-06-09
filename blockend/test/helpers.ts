import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const deployContract = async (contractName: string, constructorArgs: any[]) => {
  let factory;
  try {
    factory = await ethers.getContractFactory(contractName);
  } catch (e) {
    factory = await ethers.getContractFactory(contractName + "UpgradeableWithInit");
  }
  const contract = await factory.deploy(...(constructorArgs || []));
  await contract.deployed();
  return contract;
};

const getBlockTimestamp = async () => {
  return (await ethers.provider.getBlock("latest"))["timestamp"];
};

const mineBlockTimestamp = async (timestamp: any) => {
  await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  await ethers.provider.send("evm_mine", []);
};

const offsettedIndex = function (startTokenId, arr: any[]) {
  // return one item if arr length is 1
  if (arr.length === 1) {
    return BigNumber.from(startTokenId + arr[0]);
  }
  return arr.map((num: number) => BigNumber.from(startTokenId + num));
};

export { deployContract, getBlockTimestamp, mineBlockTimestamp, offsettedIndex };
