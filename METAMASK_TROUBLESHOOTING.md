# 🔧 MetaMask Not Triggering - Troubleshooting Guide

## ✅ ISSUE RESOLVED

### Root Cause
**Hardhat node was not running!** MetaMask cannot trigger transactions without an active blockchain connection.

### What Was Fixed
1. ✅ Started Hardhat node on http://127.0.0.1:8545
2. ✅ Deployed contract at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
3. ✅ Verified blockchain is responding

## 🎯 Complete Setup Checklist

### Step 1: Verify Hardhat Node is Running
```powershell
# Check if node is running
curl http://127.0.0.1:8545 -Method POST -Body '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -ContentType "application/json"

# If you get an error, start the node:
npx hardhat node
```

**Keep this terminal window open!** The node must stay running.

### Step 2: Configure MetaMask Network

1. **Open MetaMask Extension**
2. **Click Network Dropdown** (top of MetaMask)
3. **Click "Add Network" or "Add Network Manually"**
4. **Enter These Details:**
   ```
   Network Name: Hardhat Local
   New RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency Symbol: ETH
   ```
5. **Click "Save"**
6. **Select "Hardhat Local" from network dropdown**

### Step 3: Import Test Account

1. **Click Account Icon** (top right in MetaMask)
2. **Select "Import Account"**
3. **Paste Private Key:**
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded5c97542b7b6b78690d
   ```
4. **Click "Import"**

This is Account #0 (Owner) with 10,000 ETH for testing.

### Step 4: Test Connection

Visit: http://localhost:3000/test-metamask.html

Click "Test MetaMask" button and verify:
- ✅ MetaMask is installed
- ✅ Connected to Chain 31337 (Hardhat Local)
- ✅ Account shows with balance

## 🐛 Common Issues & Solutions

### Issue 1: "MetaMask not detected"
**Cause:** MetaMask extension not installed or disabled
**Solution:**
- Install from https://metamask.io/download/
- Enable extension in browser
- Refresh the page

### Issue 2: "Wrong network" or Chain ID mismatch
**Cause:** MetaMask connected to different network
**Solution:**
- Open MetaMask
- Switch to "Hardhat Local" network
- Refresh the page

### Issue 3: "Nonce too high" error
**Cause:** Hardhat node was restarted but MetaMask has old transaction history
**Solution:**
- Open MetaMask
- Click Account Icon → Settings → Advanced
- Scroll to "Clear activity tab data"
- Click "Clear" button
- Refresh the page

### Issue 4: "Insufficient funds" or "Gas estimation failed"
**Cause:** Account doesn't have ETH or contract not deployed
**Solution:**
- Verify Hardhat node is running
- Check contract is deployed: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- Import Account #0 with the private key above
- Should have 10,000 ETH

### Issue 5: MetaMask popup doesn't appear
**Causes & Solutions:**

**A) MetaMask popup is blocked:**
- Check for popup blocker in browser
- Look for MetaMask icon in browser toolbar - may show notification badge
- Click MetaMask icon to open pending transaction

**B) Already signed but transaction failed:**
- Check MetaMask for error message
- Look at browser console (F12) for errors
- Verify network is Hardhat Local (31337)

**C) Wrong account selected:**
- Only Owner can register workers
- Only Manufacturers can add products
- Only Distributors/Transporters can update status
- Switch to appropriate account in MetaMask

### Issue 6: "User denied transaction"
**Cause:** You clicked "Reject" in MetaMask
**Solution:**
- Click the button again
- Click "Confirm" in MetaMask popup

### Issue 7: Page not loading or blank screen
**Cause:** Frontend not running or build errors
**Solution:**
```powershell
cd frontend
npm start
```

## 🔍 Debug Steps

### 1. Open Browser Console (F12)
Look for errors in console. Common ones:

```javascript
// Good - MetaMask detected
window.ethereum is defined

// Bad - MetaMask not detected  
window.ethereum is undefined
```

### 2. Check MetaMask Connection
In browser console, run:
```javascript
// Check if MetaMask installed
console.log('MetaMask:', typeof window.ethereum !== 'undefined');

// Get current network
window.ethereum.request({ method: 'eth_chainId' })
  .then(chainId => console.log('Chain ID:', parseInt(chainId, 16)));

// Get connected accounts
window.ethereum.request({ method: 'eth_accounts' })
  .then(accounts => console.log('Accounts:', accounts));
```

### 3. Verify Contract Address
In browser console:
```javascript
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
console.log('Contract Address:', CONTRACT_ADDRESS);
```

### 4. Test Transaction Manually
In browser console:
```javascript
const { ethers } = require('ethers');

async function testTransaction() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log('Signer address:', await signer.getAddress());
  console.log('Balance:', await provider.getBalance(await signer.getAddress()));
}

testTransaction();
```

## ✅ Success Indicators

When everything works correctly:

1. **Connect Wallet:**
   - Click "Connect MetaMask" button
   - MetaMask popup appears immediately
   - Shows accounts to select
   - After selecting, wallet address appears in navbar

2. **Submit Transaction:**
   - Fill form and click submit
   - Loading spinner appears
   - MetaMask popup opens automatically
   - Shows gas estimate and transaction details
   - Click "Confirm"
   - Success message appears with TX hash

## 🎯 Quick Test

1. ✅ Hardhat node running? → Check terminal window
2. ✅ MetaMask installed? → See fox icon in browser
3. ✅ Network set to Hardhat Local (31337)? → Check MetaMask dropdown
4. ✅ Account imported with balance? → Should show ~10,000 ETH
5. ✅ Frontend running on localhost:3000? → Check browser
6. ✅ Connect button works? → Click and approve

If all above are ✅, MetaMask should trigger on every transaction!

## 🚀 Test Transaction Flow

1. **Open** http://localhost:3000
2. **Click** "🦊 Connect MetaMask" (top right)
3. **Approve** connection in MetaMask popup
4. **Navigate** to "👤 Add Worker"
5. **Fill form:**
   - Name: "Test Worker"
   - Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   - Role: Manufacturer
6. **Click** "Register Worker"
7. **MetaMask should popup immediately** ← This is where it should trigger!
8. **Click** "Confirm" in MetaMask
9. **Wait** for confirmation
10. **Success message** should appear

## 📞 Still Not Working?

Check these final items:

1. **Browser:** Use Chrome, Firefox, Edge, or Brave (MetaMask supported)
2. **MetaMask Version:** Update to latest version
3. **Clear Cache:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Disable Other Wallets:** If you have multiple wallet extensions, disable others
5. **Check Errors:** Look in browser console (F12) for red errors
6. **Restart Everything:**
   ```powershell
   # Kill all processes
   # Restart Hardhat node
   npx hardhat node
   
   # Redeploy contract
   npx hardhat run scripts/deploy.js --network localhost
   
   # Restart frontend
   cd frontend
   npm start
   ```

## 🎉 Your Setup is Working When:

- ✅ Hardhat node shows block mining messages
- ✅ MetaMask shows Hardhat Local network
- ✅ Account has ~10,000 ETH balance
- ✅ Frontend loads without errors
- ✅ Connect button opens MetaMask
- ✅ Form submissions trigger MetaMask popup
- ✅ Transactions confirm successfully
- ✅ Success messages appear with TX hashes

Now your MetaMask should be triggering correctly! 🎊
