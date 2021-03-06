# DAO

Simple decentralized organization implementation with on-chain governance system based on [openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts).

## Contracts

- Token: `ERC20Votes` token
- Governance: `Governor`
- Treasure: `TimelockController`, `ERC721Holder`, `ERC1155Holder`


## Docs

- [How to set up on-chain governance](https://docs.openzeppelin.com/contracts/4.x/governance)
- [Governor API](https://docs.openzeppelin.com/contracts/4.x/api/governance)


## Usage

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

## Tokenomics
> This is the basic setup of a DAO
[Tokenomics 101: DAOs](https://medium.com/coinmonks/tokenomics-101-daos-f22dc516fa32)

<div align="center">
  <img alt="DAO tokenomics" src="https://miro.medium.com/max/1400/0*dwy-pUuD1eFyVF0w">
</div>
