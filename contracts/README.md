# RatherGovernor & RatherToken

This is a Hardhat project, a development environment for Ethereum that makes it easy to compile, test, and deploy smart contracts.

## Getting Started

1. Clone this repository to your local machine
2. Install the dependencies
```
npm install
```

3. Create a `.env` file in the project root with the following variables:
```
ALCHEMY_PRIVATE_KEY=<your alchemy private key>
ALCHEMY_SEPOLIA_PRIVATE_KEY=<your alchemy SEPOLIA private key>
PRIVATE_KEY=<your address private key>
```
Note: You can get an Alchemy Key by signing up at https://www.alchemy.com/

## Testing

This project comes with a test file called `happy_test.js`. To run the tests, simply run the following command:
```
npx hardhat test
```
As the name indicates its only a HAPPY test, no test under stress situations.

## Deployment & Proposals Creation

This project comes with two scripts, one for deployment and other one to create a proposal using command-line:
```
npx hardhat run scripts/deploy.js
```
```
npx hardhat run scripts/create_proposal.js
```

## Conclusion
This is a basic Hardhat project that can be used as a starting point for your own projects. Happy coding!
