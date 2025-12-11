# MetaMask Integration & Enhanced UI - Setup Guide

## 🎉 What's New

### MetaMask Integration
✅ Direct blockchain interaction from frontend
✅ No backend dependency for transactions
✅ Users sign transactions with their own wallets
✅ Real-time wallet connection status
✅ Auto-detection of network and balance

### Enhanced UI
✅ Beautiful gradient backgrounds
✅ Modern card-based forms
✅ Smooth animations and transitions
✅ Timeline view for product history
✅ Real-time form validation
✅ Loading states and spinners
✅ Success/error alerts
✅ Responsive design for all screen sizes

## 📋 Prerequisites

1. **MetaMask Browser Extension**
   - Install from: https://metamask.io/download/
   - Available for Chrome, Firefox, Edge, Brave

2. **Hardhat Node Running**
   - Must be running on `http://127.0.0.1:8545`
   - Chain ID: 31337

3. **Contract Deployed**
   - Contract Address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## 🚀 Setup Steps

### Step 1: Start Hardhat Node
```powershell
cd C:\Users\DELL\OneDrive\Desktop\MajorProject\PharmaDApp
npx hardhat node
```

### Step 2: Configure MetaMask

1. Open MetaMask extension
2. Click network dropdown → "Add Network"
3. Add Hardhat Local Network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

4. Import Hardhat Test Accounts:
   - Click account icon → "Import Account"
   - Copy private key from Hardhat node output
   
   **Owner Account (Account #0)**:
   ```
   Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded5c97542b7b6b78690d
   ```

   **Manufacturer (Account #1)**:
   ```
   Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```

   **Distributor (Account #2)**:
   ```
   Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
   Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
   ```

### Step 3: Start Frontend
```powershell
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## 🎯 How to Use

### 1. Connect MetaMask
- Click "🦊 Connect MetaMask" button in the navbar
- Approve connection in MetaMask popup
- Your account address will be displayed

### 2. Register Worker (Owner Only)
- Switch to Account #0 (Owner) in MetaMask
- Navigate to "👤 Add Worker"
- Fill in:
  - Worker Name
  - Worker Wallet Address (use Account #1, #2, etc.)
  - Role (Manufacturer/Distributor/Transporter)
- Click "Register Worker"
- Confirm transaction in MetaMask

### 3. Add Product (Manufacturer Only)
- Switch to a Manufacturer account in MetaMask
- Navigate to "📦 Add Product"
- Fill in product details
- Click "Add Product"
- Confirm transaction in MetaMask

### 4. Update Status (Distributor/Transporter Only)
- Switch to a Distributor/Transporter account
- Navigate to "📝 Update Status"
- Enter product ID and tracking details
- Click "Update Status"
- Confirm transaction in MetaMask

### 5. Track Product History
- Navigate to "🔍 Track Product"
- Enter product ID
- View complete timeline of product journey

## 🔐 Role-Based Access Control

The smart contract enforces these rules:

| Action | Owner | Manufacturer | Distributor | Transporter | Consumer |
|--------|-------|--------------|-------------|-------------|----------|
| Register Workers | ✅ | ❌ | ❌ | ❌ | ❌ |
| Add Products | ❌ | ✅ | ❌ | ❌ | ❌ |
| Update Status | ❌ | ❌ | ✅ | ✅ | ❌ |
| View History | ✅ | ✅ | ✅ | ✅ | ✅ |

## 🎨 UI Features

### Form Enhancements
- Icon labels for better clarity
- Real-time validation
- Field hints and tooltips
- Loading states
- Success/error feedback

### Product History Timeline
- Chronological view
- Location tracking
- Environmental conditions
- Quality status
- Worker information
- Timestamps

### MetaMask Integration
- Wallet connection status
- Account balance display
- Network detection
- Auto-reconnect on page reload

## 🐛 Troubleshooting

### MetaMask Not Connecting
- Ensure MetaMask is installed
- Check network is set to "Hardhat Local"
- Verify Hardhat node is running
- Try disconnecting and reconnecting

### Transaction Failing
- Check you're using the correct account for the action
- Ensure contract is deployed
- Verify you have enough ETH for gas
- Check console for error messages

### "Only Owner" Error
- This action requires the contract owner account
- Switch to Account #0 in MetaMask

### "Only Manufacturer" Error
- Only manufacturer accounts can add products
- Switch to a registered manufacturer account

### "Only Distributor/Transporter" Error
- Only distributor/transporter accounts can update status
- Switch to a registered distributor or transporter account

## 📝 Notes

- All transactions require MetaMask confirmation
- Gas fees are paid from connected account
- Hardhat local network gives each account 10,000 ETH
- Contract state resets when Hardhat node restarts
- Backend is now optional (only for statistics/caching)

## 🔄 Backend vs MetaMask

**Previous Setup (Backend-Signed)**:
- Backend signs all transactions
- Same account for all users
- No role separation
- Faster (no user confirmation)

**Current Setup (MetaMask)**:
- Users sign their own transactions
- Each user uses their own account
- True role-based access control
- Requires user confirmation

You can keep both approaches - use backend for automated tasks and MetaMask for user actions!

## 🎯 Testing Workflow

1. **Start as Owner** (Account #0)
   - Register 3 workers with different roles
   - Use Account #1 as Manufacturer
   - Use Account #2 as Distributor
   - Use Account #3 as Transporter

2. **Switch to Manufacturer** (Account #1)
   - Add a product
   - Note the product ID

3. **Switch to Distributor** (Account #2)
   - Update status for the product
   - Change location/temperature/etc.

4. **Switch to Transporter** (Account #3)
   - Update status again
   - Track product movement

5. **View as Anyone**
   - Track product history
   - See complete timeline

## 🌟 Enjoy Your Enhanced DApp!

Your pharmaceutical supply chain now has:
- ✅ Real blockchain interaction
- ✅ Beautiful modern UI
- ✅ Role-based security
- ✅ Professional user experience
