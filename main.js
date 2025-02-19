require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

// Load wallets from wallets.json
const wallets = require('./wallets.json');

// Public RPC URLs (No API key needed)
const SEPOLIA_RPC = "https://ethereum-sepolia.publicnode.com";
const LENS_RPC = "https://rpc.lens.dev"; // Replace if needed

const sepoliaWeb3 = new Web3(new Web3.providers.HttpProvider(SEPOLIA_RPC));
const lensWeb3 = new Web3(new Web3.providers.HttpProvider(LENS_RPC));

// Contract Addresses (Replace with actual addresses)
const BRIDGE_CONTRACT_ADDRESS = "0xBridgeContractAddress"; // Update with actual bridge contract
const FAUCET_CONTRACT_ADDRESS = "0xFaucetContractAddress"; // Update with actual faucet contract

// ABI Definitions (Replace with actual ABI)
const BRIDGE_ABI = [ /* Bridge Contract ABI Here */ ];
const FAUCET_ABI = [ /* Faucet Contract ABI Here */ ];

const bridgeContract = new sepoliaWeb3.eth.Contract(BRIDGE_ABI, BRIDGE_CONTRACT_ADDRESS);
const faucetContract = new lensWeb3.eth.Contract(FAUCET_ABI, FAUCET_CONTRACT_ADDRESS);

async function bridgeFunds(wallet) {
    const account = sepoliaWeb3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    sepoliaWeb3.eth.accounts.wallet.add(account);

    const amountToBridge = sepoliaWeb3.utils.toWei("0.01", "ether"); // Adjust amount if needed
    const gasPrice = await sepoliaWeb3.eth.getGasPrice();

    const tx = {
        from: account.address,
        to: BRIDGE_CONTRACT_ADDRESS,
        gas: 200000, // Adjust gas limit
        gasPrice: gasPrice,
        data: bridgeContract.methods.bridgeTokens(amountToBridge).encodeABI()
    };

    const signedTx = await account.signTransaction(tx);
    const receipt = await sepoliaWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`✅ Bridged funds for ${wallet.address}: ${receipt.transactionHash}`);
}

async function claimFaucet(wallet) {
    const account = lensWeb3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    lensWeb3.eth.accounts.wallet.add(account);

    const gasPrice = await lensWeb3.eth.getGasPrice();

    const tx = {
        from: account.address,
        to: FAUCET_CONTRACT_ADDRESS,
        gas: 150000, // Adjust gas limit
        gasPrice: gasPrice,
        data: faucetContract.methods.claimTokens().encodeABI()
    };

    const signedTx = await account.signTransaction(tx);
    const receipt = await lensWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`✅ Claimed faucet for ${wallet.address}: ${receipt.transactionHash}`);
}

async function main() {
    for (const wallet of wallets) {
        console.log(`🔄 Processing wallet: ${wallet.address}`);
        await bridgeFunds(wallet);
        await claimFaucet(wallet);
    }
    console.log("🎉 All wallets processed.");
}

main().catch(console.error);
