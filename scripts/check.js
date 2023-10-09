const abi = require("../artifacts/contracts/Box.sol/Box.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_RPC_URL
  );
  let privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  const connectedContract = new ethers.Contract(
    "0xb6a24f3de5acd15c18db932c425acb1d224a8e56",
    abi.abi,
    wallet
  );
  const value = await connectedContract.retrieve();
  console.log(value);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
