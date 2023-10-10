# Smart Contracts Proxies and Upgradability

Smart contracts are integral components of blockchain applications, providing the foundational logic for decentralized operations. However, as blockchain technology evolves, the need for smart contract upgradability becomes apparent. This README explores the necessity of smart contract upgrades and various strategies for achieving them.

## Why Upgrade Smart Contracts?

1. **Adding Missing Features**: Sometimes, you may need to add new features to your smart contract that were not initially included.

2. **Bug Fixes**: Smart contracts may contain bugs or vulnerabilities that need to be addressed.

3. **Gas Optimization**: To optimize gas usage, especially in high-traffic applications.

4. **Regulatory Changes**: Changes in government regulations might necessitate modifications to your contract.

5. **Compatibility**: Compatibility issues may arise as libraries are upgraded with ERC standards or security updates.

## Ways to Upgrade Smart Contracts

1. **Contract Migration**:

   - _Example_: Imagine you have a decentralized exchange (DEX) smart contract. To upgrade it, deploy a new DEX contract and transfer user balances and data from the old contract to the new one.
   - _Platform_: Ethereum and other blockchain platforms have used contract migration for upgrading various smart contracts.

2. **Data Separation**:

   - _Example_: In a token smart contract, separate the business logic (e.g., token transfers) into one contract and data storage (e.g., user balances) into another contract. The logic contract interacts with the storage contract.
   - _Platform_: This approach is commonly used in Ethereum-based token contracts.

3. **Proxy Patterns**:

   - _Example_: Create a proxy contract that delegates function calls to a logic contract. Users interact with the proxy, and you can upgrade the logic contract by changing the address in the proxy.
   - _Platform_: The Gnosis Safe Multisig Wallet uses a proxy pattern to facilitate upgradability.

4. **Strategy Pattern**:

   - _Example_: In a lending protocol, have a main contract that interfaces with various lending strategies. Upgrade the protocol by adding a new lending strategy and configuring the main contract to use it.
   - _Platform_: Platforms like Yearn Finance use the strategy pattern for upgrading DeFi protocols.

5. **Diamond Pattern**:
   - _Example_: Consider a complex DeFi protocol with many functions. Use a diamond pattern to split functions across multiple logic contracts (facets) and configure a proxy to delegate calls to the appropriate facet.
   - _Platform_: The Aave Protocol has implemented the diamond pattern to handle its large and complex smart contract codebase efficiently.

## Proxies in Smart Contracts

### How Proxies Work

1. An external caller makes a function call to the proxy.
2. The proxy delegates the call to the delegate, where the function code is located.
3. The result is returned to the proxy, which forwards it to the caller.

The `delegatecall` opcode is used to delegate the call, executing the function in the context of the proxy. This means that the proxy's storage is used for function execution.

### DelegateCall in Solidity

[DelegateCall](https://solidity-by-example.org/delegatecall/) is a low-level Solidity opcode that allows a contract to execute code from another contract, using the state and storage of the calling contract.

### Proxy Patterns

Given the pattern's logic, the proxy is also known as a dispatcher that delegates calls to specific modules, which are called delegates by the proxy contract.

### Problems with Proxies

- **Storage Collisions**: [Read more](https://ethereum-blockchain-developer.com/110-upgrade-smart-contracts/06-storage-collisions/)
- **Function Selector Clashes**: [Read more](https://solidity-by-example.org/function-selector/)
  - Example: `collate_propagate_storage(bytes16)` and `burn(uint256)` have the same function selector `0x42966c68`.

### Three Proxy Patterns

1. **Transparent Proxy Pattern**:

   - Admin (can only call) -> Admin Functions
   - Users (can only call) -> Implementation Functions
   - This helps avoid function selector clashes.

2. **Universal Upgradable Proxies (UUPS)**:

   - Puts all the logic of upgrading in the implementation itself.
   - Advantages: Gas efficient (less read), small proxy contract.
   - Issue: If you deploy an implementation contract without any upgradable functions, you are stuck.

3. **Diamond Pattern**:
   - Transfer -> Diamond Proxy -> Facet Transfer
     -> Facet Approve
     .
     .
     -> Implementation
   - This pattern is useful for very large contracts, splitting logic into different facets.

## Notes

- You can't have a constructor but can use an initializer function.
- Deployment example:
  ```javascript
  const proxy = await upgrades.deployProxy(
    Contract_name,
    [Initializing_value],
    { initializer: "function_name" }
  );
  ```
- Upgrade example:
  ```javascript
  let box = await upgrades.upgradeProxy(
    "0xb6a24f3de5ACd15C18Db932C425AcB1D224A8e56",
    BoxV2
  );
  ```

## Additional Resources

- Step-by-step guide by OpenZeppelin: [OpenZeppelin Upgrades Tutorial](https://forum.openzeppelin.com/t/openzeppelin-upgrades-step-by-step-tutorial-for-hardhat/3580)
- OpenZeppelin Upgrades Plugins Documentation: [OpenZeppelin Upgrades Plugins](https://docs.openzeppelin.com/upgrades-plugins/1.x/)

## Get started

- clone the repo

```shell
git clone https://github.com/sarvagnakadiya/upgradable-smart-contract-demo.git

```

```shell
cd upgradable-smart-contract-demo
```

The library seems conflicting with ethers lib, so have to use legacy peer deps

```shell
npm install --legacy-peer-deps
```

To deploy your V1 contract

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

To upgrade your contract to BoxV2

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

Now, you can call increment function from v2 and call the retrieve function to check the value is updated or not, as we have used v2. And if it is, CONGRATULATIONS its upgraded.

There's a check.js file to check the balance.
