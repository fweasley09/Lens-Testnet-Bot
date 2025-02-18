# Lens Bridge Automation Script
This script automates the process of bridging from Sepolia to Lens Network Sepolia and claiming the faucet daily for multiple accounts.

# Features

- Automates the bridging and claiming process.

- Supports multiple accounts (loaded from a JSON file).

- Runs every 8 hours using a scheduler.

# Requirements

- Node.js (latest LTS version recommended)

- Puppeteer

- Node-cron

# Installation

1. Clone this repository:

```sh
git clone https://github.com/your-repo/lens-bridge-bot.git
cd lens-bridge-bot
```
2. Install dependencies:

```sh
npm install
```

3. Create a wallets.json file in the root directory with the following structure:

```sh
[
    { "address": "0xYourAddress1", "privateKey": "your-private-key-1" },
    { "address": "0xYourAddress2", "privateKey": "your-private-key-2" }
]
```

# Running the Script

To run the script manually:
```sh
node main.js
```
The script is scheduled to run automatically every 8 hours using node-cron.

# Notes

- Ensure your wallets have enough funds for transactions.

- You may need to integrate Metamask automation if required.

# License

MIT License
