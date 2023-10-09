async function main() {
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  let box = await upgrades.upgradeProxy(
    "0xb6a24f3de5ACd15C18Db932C425AcB1D224A8e56",
    BoxV2
  );
  console.log("Your upgraded proxy is done!", box.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
