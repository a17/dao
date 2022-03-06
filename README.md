# DAO

Simple decentralized organization implementation with onchain-voting governance system based on [OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts).

- Token: `ERC20Votes` token
- Governance: `Governor`
- Treasure: `TimelockController`, `ERC721Holder`, `ERC1155Holder`

```shell
yarn
hardhat accounts
hardhat compile
hardhat clean
hardhat test
hardhat node
hardhat help
REPORT_GAS=true hardhat test
hardhat coverage
hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
eslint '**/*.{js,ts}'
eslint '**/*.{js,ts}' --fix
prettier '**/*.{json,sol,md}' --check
prettier '**/*.{json,sol,md}' --write
solhint 'contracts/**/*.sol'
solhint 'contracts/**/*.sol' --fix
hardhat run --network ropsten scripts/deploy.ts
hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "string param1"
```
