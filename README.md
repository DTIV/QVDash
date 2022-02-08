---
description: A Overview of QVDash Application.
---

# QVDash

This react application is our submission for Gitcoin's : [Schelling Point Virtual Hackathon](https://gitcoin.co/hackathon/schellingpoint)

&#x20;[**Quadratic Voting Platform Bounty**](https://gitcoin.co/issue/covalenthq/covalent-gitcoin-bounties/13/100027480)

#### View Live Site:

{% embed url="https://amazing-keller-2bf46c.netlify.app" %}

QVDash is a multi-chain, quadratic voting platform, Currently deployed on the Rinkeby Testnet, users can vote quadratically on various organization's proposals. Organizations are created by entering the protocol contract address, a name for the protocol (if a contract has no name) and the amount of credits per voter. CPV can be changed in the future.&#x20;

We have added several organizations for hackathon display purposes, and organization ownership can be transferred to rightful contract owners. This application utilizes the covalent API to access network and contract data for different organizations on multiple different networks.

### Getting Started

* Clone Repository
* Install Packages

```
npm install
```

```
yarn install
```

* Create A Covalent API Key

{% embed url="https://www.covalenthq.com/platform#/apikey/" %}

* Create .env file with the .sample\_env file profided
* Add the covalent API key

```
REACT_APP_COVKEY = "ckey_"
```

* Start the application

```
npm start
```

```
yarn start
```

### Deploying

This application can be deployed on multiple chains, the frontend will recognize which network the user is connected to and will select the correct network accordingly based on the supported networks provided by the Covalent API + Rinkeby Testnet, Currently there is no script to sort and change contract data on network changes, so QVDash will only work on a single deployed network, currently Rinkeby. To deploy on another network follow these steps.

* Delete contractData Folder in /src/ directory
* Delete absract and cache in /src/hardhat directory
* Create Alchemy or Infura API Key

{% embed url="https://www.alchemy.com" %}

{% embed url="https://infura.io" %}

* Add Alchemy or Infura API Key and a private key to .env file

```
REACT_APP_ALCHEMY_KOVAN = "ALCHEMY_URL"
REACT_APP_PRIVATE_KEY = "PK"
```

* Add new network to hardhat.config in project folder

```
networks:{
    kovan:{
      url: process.env.REACT_APP_ALCHEMY_KOVAN,
      accounts:[process.env.REACT_APP_PRIVATE_KEY]
    }
  },
```

* Deploy to network

```
npx hardhat run src/hardhat/scripts/deploy.js --network kovan
```
