# 🦊 MetaMask Configuration - Step by Step

## Current Status: ✅ READY TO USE

- ✅ Hardhat node is running on http://127.0.0.1:8545
- ✅ Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- ✅ Frontend running on http://localhost:3000

## 🎯 Follow These Steps Exactly

### Step 1: Add Hardhat Network to MetaMask

1. **Click the MetaMask fox icon** in your browser toolbar
2. **Click the network dropdown** at the top (might say "Ethereum Mainnet")
3. **Click "Add Network"** at the bottom
4. **Click "Add a network manually"**
5. **Fill in these exact values:**

```
Network Name: Hardhat Local
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Block Explorer URL: (leave empty)
```

6. **Click "Save"**
7. **MetaMask will switch to this network automatically**

### Step 2: Import Owner Account

1. **Click the account icon** (circle/identicon at top right)
2. **Select "Import Account"**
3. **Paste this private key:**

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded5c97542b7b6b78690d
```

4. **Click "Import"**

You should now see:
- Account name: "Account 2" or similar
- Balance: **10000 ETH**
- Address: 0xf39F...2266

### Step 3: Test the Connection

1. **Go to** http://localhost:3000
2. **You should see:**
   - Purple gradient navbar
   - "🦊 Connect MetaMask" button on the right
3. **Click "Connect MetaMask"**
4. **MetaMask popup will appear asking:**
   - "Connect with MetaMask"
   - Shows your account with 10000 ETH
5. **Click "Next"**
6. **Click "Connect"**
7. **You should now see:**
   - Your address in the navbar: "Connected: 0xf39F...2266"
   - Balance: 10000 ETH
   - Network: Hardhat Local

### Step 4: Test a Transaction

1. **Click "👤 Add Worker"** in the left sidebar
2. **Fill in the form:**
   ```
   Worker Name: Alice Smith
   Wallet Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   Role: Manufacturer
   ```
3. **Click "Register Worker"** button
4. **MetaMask popup SHOULD APPEAR NOW** 🎯
   - Shows transaction details
   - Gas fee estimate
   - Total amount
5. **Click "Confirm"** in MetaMask
6. **Wait 1-2 seconds**
7. **Success message appears:** "✅ Worker registered successfully!"

## 🎉 Success! MetaMask is Working!

If you saw the MetaMask popup in Step 4, you're all set!

## 🔧 If MetaMask Still Doesn't Trigger

### Check 1: Is MetaMask on the Correct Network?
- Open MetaMask
- Top of window should say **"Hardhat Local"**
- If not, click network dropdown and select "Hardhat Local"

### Check 2: Is the Account Connected?
- Navbar should show: "Connected: 0xf39F..."
- If not, click "Connect MetaMask" button again

### Check 3: Check Browser Console
1. **Press F12** (or right-click → Inspect)
2. **Click "Console" tab**
3. **Look for errors (red text)**
4. Common errors:
   - "window.ethereum is undefined" → MetaMask not installed
   - "User rejected the request" → You clicked Reject
   - "Invalid chainId" → Wrong network selected

### Check 4: Clear MetaMask Activity
If you restarted Hardhat node:
1. Open MetaMask
2. Settings → Advanced
3. Scroll down to "Clear activity tab data"
4. Click "Clear"
5. Refresh page and try again

### Check 5: Popup Blockers
- Check if browser is blocking popups
- Look for blocked popup icon in address bar
- Add localhost:3000 to allowed sites

## 📱 Testing Other Roles

### Add Manufacturer Account
```
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

### Add Distributor Account  
```
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

To import additional accounts:
1. Click account icon in MetaMask
2. Select "Import Account"
3. Paste private key
4. Click "Import"

## 🎯 Transaction Flow

Every transaction follows this pattern:

1. **User fills form** → Form validates
2. **User clicks submit** → Loading spinner appears
3. **Frontend calls ethers.js** → Prepares transaction
4. **MetaMask popup appears** ← **THIS IS THE KEY MOMENT**
5. **User clicks Confirm** → Transaction sent to blockchain
6. **Wait for mining** → Usually 1-2 seconds on Hardhat
7. **Success!** → Green message with TX hash

## ✅ Verification Checklist

Before reporting issues, verify all of these:

- [ ] MetaMask extension installed (see fox icon in browser)
- [ ] Hardhat node running (check terminal window)
- [ ] Network set to "Hardhat Local" (Chain ID: 31337)
- [ ] Account imported (shows 10000 ETH balance)
- [ ] Frontend running (http://localhost:3000 loads)
- [ ] Connected to DApp (address shown in navbar)
- [ ] Contract deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3
- [ ] No console errors (F12 → Console tab)

## 🎊 You're Ready!

Your MetaMask should now trigger on every transaction. Enjoy your decentralized pharmaceutical supply chain DApp!

**Need help?** Check METAMASK_TROUBLESHOOTING.md for detailed debugging steps.
