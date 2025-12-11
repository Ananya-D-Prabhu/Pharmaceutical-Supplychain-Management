# Role-Based Access Control Deployment Guide

## Changes Made

### Smart Contract (SupplyChain.sol)
✅ Added role-based access control with modifiers:
- `onlyOwner` - Only contract owner can register workers
- `onlyManufacturer` - Only manufacturers can add products
- `onlyDistributorOrTransporter` - Only distributors/transporters can update status

✅ Added address-to-worker mappings:
- `addressToWorkerId` - Maps Ethereum addresses to worker IDs
- `isRegisteredWorker` - Tracks registered worker addresses

✅ Updated function signatures:
- `registerWorker(string name, WorkerType role, address workerAddress)` - Now requires wallet address
- `addProduct(...)` - Removed `manufacturerId` parameter (auto-detected from msg.sender)
- `updateStatus(...)` - Removed `workerId` parameter (auto-detected from msg.sender)

### Backend Updates
✅ `model.py`:
- Added `walletAddress` to WorkerModel
- Removed `manufacturerId` from ProductModel
- Removed `workerId` from StatusModel

✅ `routers/workers.py`:
- Updated to pass `walletAddress` to contract

✅ `routers/products.py`:
- Removed `manufacturerId` parameter

✅ `routers/status.py`:
- Removed `workerId` parameter

### Frontend Updates
✅ `AddWorker.jsx`:
- Added wallet address input field
- Updated heading to show "Owner Only"

✅ `AddProduct.jsx`:
- Removed manufacturer ID field
- Updated heading to show "Manufacturer Only"

✅ `AddStatus.jsx`:
- Removed worker ID field
- Updated heading to show "Distributor/Transporter Only"

## Deployment Steps

### Step 1: Redeploy Smart Contract
```powershell
# Make sure Hardhat node is running
npx hardhat node

# In a new terminal, deploy the contract
npx hardhat run scripts/deploy.js --network localhost
```

**Important**: Copy the new contract address from the deployment output!

### Step 2: Update Backend Configuration
Edit `backend/.env` and update:
```
CONTRACT_ADDRESS=<YOUR_NEW_CONTRACT_ADDRESS>
```

### Step 3: Update Contract ABI (if needed)
The contract ABI should auto-update, but verify:
```powershell
# The ABI is in artifacts/contracts/SupplyChain.sol/SupplyChain.json
# Backend reads from backend/SupplyChain.json
# Copy if needed
```

### Step 4: Restart Backend
```powershell
cd backend
python main.py
```

### Step 5: Restart Frontend
```powershell
cd frontend
npm start
```

## Testing Role-Based Access

### Test 1: Register Worker (Owner Only)
- Use the deployer account (Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
- In AddWorker form:
  - Name: "John Manufacturer"
  - Wallet Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Account #1)
  - Role: Manufacturer
- Submit → Should succeed

### Test 2: Add Product (Manufacturer Only)
**Current Setup**: Backend uses Account #0 (owner) to sign all transactions.

To test properly, you need to:
1. Register a worker with a manufacturer role
2. Update backend `.env` to use that worker's private key
3. Restart backend
4. Try adding a product → Should succeed
5. Change `.env` to a distributor's private key → Adding product should fail

### Test 3: Update Status (Distributor/Transporter Only)
Similar to Test 2:
1. Register a distributor/transporter
2. Update backend to use their private key
3. Try updating status → Should succeed
4. Use manufacturer's private key → Should fail

## Important Notes

### Current Limitation
⚠️ **All transactions are signed by the same account** (Account #0 in `.env`)

For true role-based access:
1. Each worker needs their own private key
2. Frontend needs to send the worker's address with each request
3. Backend needs to switch signing keys based on the worker
4. OR implement MetaMask connection so each worker signs with their own wallet

### Hardhat Test Accounts
```
Account #0 (Owner): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded5c97542b7b6b78690d

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

## Verification

After deployment, verify:
1. ✅ Contract deploys successfully
2. ✅ Owner can register workers with addresses
3. ✅ Workers are mapped to their addresses
4. ✅ Appropriate error messages when wrong role tries restricted action
5. ✅ View functions (getProductHistory, getWorkers) still work for everyone

## Next Steps (Optional Enhancements)

1. **Multi-Account Backend**: Allow backend to sign with different keys based on worker
2. **MetaMask Integration**: Let workers sign transactions from their own wallets
3. **Login System**: Authenticate workers by their Ethereum address
4. **Worker Dashboard**: Show role-specific functions based on logged-in worker
5. **Event Logging**: Emit events for all actions for audit trail
