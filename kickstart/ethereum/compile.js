const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// get path to build folder
const buildPath = path.resolve(__dirname, 'build');
// delete build folder
fs.removeSync(buildPath);

// get path to Campaigns.sol
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
// read campaign file
const source = fs.readFileSync(campaignPath, 'utf8');
// compile contracts and get contracts
const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
    },
};
// const output = solc.compile(output, 1);
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "Campaign.sol"
];
    
// create build folder
fs.ensureDirSync(buildPath);
    
// loop over output and write each contract to different file in build directory
for (let contract in output) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(":", "") + ".json"),
      output[contract]
    );
}