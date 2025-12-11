# 🔧 Fixing "NOT A REGISTERED WORKER" Error

## 🎯 What This Error Means

When you see **"NOT A REGISTERED WORKER"**, it means:
- You're trying to add a product (requires Manufacturer role)
- OR you're trying to update status (requires Distributor/Transporter role)
- BUT your MetaMask account address is not registered in the smart contract

## ✅ Solution: Register Your Account First

### Step 1: Identify Your Accounts

You need **at least 2 accounts**:
1. **Owner Account** (Account #0) - Registers workers
2. **Worker Account** (Account #1+) - Performs actions

### Step 2: Import Both Accounts into MetaMask

**Import Owner Account (Account #0):**
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded5c97542b7b6b78690d
Role: Contract Owner (can register workers)
```

**Import Worker Account (Account #1):**
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Role: Will be Manufacturer
```

**Import Account #2 (for Distributor):**
```
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Role: Will be Distributor
```

### Step 3: Register Workers (Use Owner Account)

1. **Switch to Owner Account in MetaMask**
   - Click account icon in MetaMask
   - Select Account #0 (0xf39F...2266)

2. **Connect to DApp**
   - Go to http://localhost:3000
   - Click "🦊 Connect MetaMask"
   - Approve connection

3. **Navigate to "Add Worker"**
   - Click "👤 Add Worker" in sidebar

4. **Register Account #1 as Manufacturer**
   ```
   Worker Name: Alice (Manufacturer)
   Wallet Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   Role: Manufacturer
   ```
   - Click "Register Worker"
   - Confirm in MetaMask
   - Wait for success message

5. **Register Account #2 as Distributor**
   ```
   Worker Name: Bob (Distributor)
   Wallet Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
   Role: Distributor
   ```
   - Click "Register Worker"
   - Confirm in MetaMask
   - Wait for success message

### Step 4: Use Worker Accounts

**To Add Products:**
1. Switch to Account #1 (Manufacturer) in MetaMask
2. Refresh page or reconnect
3. Go to "📦 Add Product"
4. Fill form and submit
5. ✅ Should work now!

**To Update Status:**
1. Switch to Account #2 (Distributor) in MetaMask
2. Refresh page or reconnect
3. Go to "📝 Update Status"
4. Fill form and submit
5. ✅ Should work now!

## 🔍 How to Check if You're Registered

Open browser console (F12) and run:

```javascript
// Replace with your actual address
const myAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

// Check if registered
const { ethers } = require('ethers');
const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  ["function isRegisteredWorker(address) view returns (bool)"],
  provider
);

contract.isRegisteredWorker(myAddress).then(isRegistered => {
  console.log("Is Registered:", isRegistered);
});
```

## 📋 Complete Workflow

### For Owner (Registering Workers):
1. ✅ Use Account #0 (0xf39F...2266)
2. ✅ Go to "Add Worker" tab
3. ✅ Enter worker details with their wallet address
4. ✅ Submit and confirm in MetaMask

### For Manufacturer (Adding Products):
1. ✅ First register as Manufacturer (use Owner account)
2. ✅ Switch to Manufacturer account in MetaMask
3. ✅ Reconnect to DApp
4. ✅ Go to "Add Product" tab
5. ✅ Submit and confirm

### For Distributor/Transporter (Updating Status):
1. ✅ First register as Distributor/Transporter (use Owner account)
2. ✅ Switch to that account in MetaMask
3. ✅ Reconnect to DApp
4. ✅ Go to "Update Status" tab
5. ✅ Submit and confirm

## ⚠️ Common Mistakes

### Mistake 1: Using Wrong Account
**Problem:** Trying to add product with Owner account
**Solution:** Switch to a registered Manufacturer account

### Mistake 2: Not Reconnecting After Switch
**Problem:** Switched accounts in MetaMask but DApp still uses old account
**Solution:** 
- Disconnect wallet in DApp
- Reconnect with new account
- OR hard refresh (Ctrl+Shift+R)

### Mistake 3: Registering Wrong Address
**Problem:** Registered address doesn't match the account you're using
**Solution:** 
- Check the address you registered
- Make sure it matches the MetaMask account address exactly
- Addresses are case-insensitive but must be exact

### Mistake 4: Not Importing Account
**Problem:** Using MetaMask default account that has no test ETH
**Solution:** Import the Hardhat test accounts using private keys above

## 🎯 Quick Fix Script

If you want to register all accounts at once, use Owner account and run:

**Register Account #1 (Manufacturer):**
- Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
- Name: Alice
- Role: Manufacturer

**Register Account #2 (Distributor):**
- Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
- Name: Bob
- Role: Distributor

**Register Account #3 (Transporter):**
- Address: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
- Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
- Name: Charlie
- Role: Transporter

## 🔄 If You Restart Hardhat Node

**Important:** When you restart the Hardhat node, all data is lost!

You must:
1. ✅ Redeploy contract
2. ✅ Clear MetaMask activity data (Settings → Advanced → Clear activity)
3. ✅ Register all workers again
4. ✅ Then use worker accounts

## ✅ Verification Steps

Before trying to add products or update status:

1. **Verify Owner Account:**
   - [ ] Owner account imported (0xf39F...2266)
   - [ ] Has ~10,000 ETH balance
   - [ ] Can access "Add Worker" page

2. **Verify Worker Registration:**
   - [ ] Registered as Manufacturer/Distributor/Transporter
   - [ ] Used correct wallet address
   - [ ] Saw success message
   - [ ] Transaction confirmed

3. **Verify Worker Account:**
   - [ ] Worker account imported
   - [ ] Has ETH balance
   - [ ] Connected to DApp
   - [ ] Address matches registered address

4. **Try Transaction:**
   - [ ] Use registered worker account
   - [ ] Fill form correctly
   - [ ] MetaMask popup appears
   - [ ] ✅ NO "NOT A REGISTERED WORKER" error!

## 🎊 Success Indicators

When everything is set up correctly:
- ✅ Owner can register workers without errors
- ✅ Manufacturers can add products
- ✅ Distributors/Transporters can update status
- ✅ All roles see success messages
- ✅ No "NOT A REGISTERED WORKER" errors

## 📞 Still Getting the Error?

**Double-check these:**

1. **Current MetaMask Account:**
   - Open MetaMask
   - Check address shown at top
   - Make sure it matches a registered worker

2. **Account Role Matches Action:**
   - Adding product? Must be Manufacturer
   - Updating status? Must be Distributor or Transporter
   - Registering worker? Must be Owner

3. **Registration Succeeded:**
   - Check transaction was confirmed
   - Look for success message
   - Verify in blockchain (check Hardhat node logs)

4. **Connected to Correct Network:**
   - MetaMask shows "Hardhat Local"
   - Chain ID is 31337

5. **Using Correct Contract:**
   - Contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   - Deployed on current Hardhat session

## 🚀 Ready to Go!

Once you register your accounts:
1. Owner registers workers ✅
2. Switch to worker account ✅
3. Perform actions ✅
4. No more "NOT A REGISTERED WORKER" error! ✅

Now you can use all features of your pharmaceutical supply chain DApp! 🎉
