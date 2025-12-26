# 🔐 Role-Based Access Control Guide

## Overview

The system now has role-based access control where users only see and access features relevant to their role.

## 👥 Roles & Permissions

### 🏢 OWNER (Contract Deployer)
**Can Access:**
- ✅ Dashboard
- ✅ Add Worker (Register new users)
- ✅ View Products
- ✅ Track Product
- ✅ Performance Rankings
- ✅ Verify Product

**Cannot Access:**
- ❌ Add Product (Only manufacturers)
- ❌ Assign Workers
- ❌ Update Status
- ❌ Generate QR

---

### 🏭 MANUFACTURER
**Can Access:**
- ✅ Dashboard
- ✅ **Add Product** (Create new products)
- ✅ **Assign Workers** (Assign distributors)
- ✅ View Products
- ✅ Track Product
- ✅ Performance Rankings
- ✅ Generate QR
- ✅ Verify Product

**Cannot Access:**
- ❌ Add Worker (Only owner)
- ❌ Update Status (Only distributors/transporters)

---

### 🚚 DISTRIBUTOR
**Can Access:**
- ✅ Dashboard
- ✅ **Assign Workers** (Assign transporters)
- ✅ **Update Status** (Add temperature/location updates)
- ✅ View Products
- ✅ Track Product
- ✅ Performance Rankings
- ✅ Generate QR
- ✅ Verify Product

**Cannot Access:**
- ❌ Add Worker (Only owner)
- ❌ Add Product (Only manufacturers)

---

### ✈️ TRANSPORTER
**Can Access:**
- ✅ Dashboard
- ✅ **Update Status** (Add temperature/location updates)
- ✅ View Products
- ✅ Track Product
- ✅ Performance Rankings
- ✅ Verify Product

**Cannot Access:**
- ❌ Add Worker (Only owner)
- ❌ Add Product (Only manufacturers)
- ❌ Assign Workers (Only manufacturers/distributors)
- ❌ Generate QR

---

## 🔄 Workflow Example

### Product Lifecycle

```
1. OWNER
   └─ Registers workers (manufacturers, distributors, transporters)

2. MANUFACTURER
   └─ Creates product (vaccine, medicine)
   └─ Assigns distributor based on performance
   
3. DISTRIBUTOR
   └─ Updates product status (temperature, location)
   └─ Assigns transporter based on performance
   
4. TRANSPORTER
   └─ Updates product status during delivery
   └─ Final delivery confirmation
```

## 🚀 Getting Started

### Step 1: Owner Setup
```
1. Deploy contract (owner account)
2. Connect with owner wallet
3. See "OWNER" badge in sidebar
4. Go to "Add Worker"
5. Register:
   - Manufacturers (Role: 0)
   - Distributors (Role: 1)
   - Transporters (Role: 2)
```

### Step 2: Manufacturer Usage
```
1. Connect with manufacturer wallet
2. See "MANUFACTURER" badge
3. Go to "Add Product"
4. Create products with temp requirements
5. Go to "Assign Workers"
6. Select best distributor
```

### Step 3: Distributor Usage
```
1. Connect with distributor wallet
2. See "DISTRIBUTOR" badge
3. Go to "Update Status"
4. Add temperature readings
5. Go to "Assign Workers"
6. Select best transporter
```

### Step 4: Transporter Usage
```
1. Connect with transporter wallet
2. See "TRANSPORTER" badge
3. Go to "Update Status"
4. Add delivery updates
5. Track performance in rankings
```

## 🎯 Access Control Matrix

| Feature | Owner | Manufacturer | Distributor | Transporter |
|---------|-------|--------------|-------------|-------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Add Worker | ✅ | ❌ | ❌ | ❌ |
| Add Product | ❌ | ✅ | ❌ | ❌ |
| Assign Workers | ❌ | ✅ | ✅ | ❌ |
| Update Status | ❌ | ❌ | ✅ | ✅ |
| View Products | ✅ | ✅ | ✅ | ✅ |
| Track Product | ✅ | ✅ | ✅ | ✅ |
| Performance | ✅ | ✅ | ✅ | ✅ |
| Generate QR | ❌ | ✅ | ✅ | ❌ |
| Verify Product | ✅ | ✅ | ✅ | ✅ |

## 🔧 Testing Roles

### Using Hardhat Accounts

When you run `npx hardhat node`, you get 20 test accounts:

```javascript
// Account #0 (Owner - deploys contract)
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// Account #1 (Use as Manufacturer)
0x70997970C51812dc3A010C7d01b50e0d17dc79C8

// Account #2 (Use as Distributor)
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

// Account #3 (Use as Transporter)
0x90F79bf6EB2c4f870365E785982E1f101E93b906
```

### Test Flow

1. **Connect with Account #0** (Owner)
   - Register Account #1 as Manufacturer
   - Register Account #2 as Distributor
   - Register Account #3 as Transporter

2. **Switch to Account #1** (Manufacturer)
   - Sidebar shows "MANUFACTURER" badge
   - Menu shows: Add Product, Assign Workers
   - Create a product

3. **Switch to Account #2** (Distributor)
   - Sidebar shows "DISTRIBUTOR" badge
   - Menu shows: Update Status, Assign Workers
   - Add status updates

4. **Switch to Account #3** (Transporter)
   - Sidebar shows "TRANSPORTER" badge
   - Menu shows: Update Status only
   - Add delivery updates

## 📱 Switching Accounts in MetaMask

1. Click MetaMask extension
2. Click account avatar (top right)
3. Select different account
4. UI automatically updates to show relevant menu

## ⚠️ Error Messages

### "Account Not Registered"
**Cause:** Connected wallet is not registered as a worker
**Solution:** Owner must register this address via "Add Worker"

### Menu is Empty
**Cause:** Wallet not connected or not registered
**Solution:** 
1. Connect MetaMask
2. Ensure owner has registered your address

### "Please connect your wallet"
**Cause:** MetaMask not connected
**Solution:** Click "Connect MetaMask" button

## 💡 Key Changes

### What Changed:
1. ✅ Role detection on wallet connection
2. ✅ Dynamic menu based on role
3. ✅ Role badge displayed in sidebar
4. ✅ Welcome screens for non-registered users
5. ✅ Owner cannot add products (only manufacturers)
6. ✅ Each role sees only relevant features

### Benefits:
- 🔒 **Security**: Users can't access features they shouldn't
- 🎯 **Clarity**: Clean UI showing only relevant options
- 👥 **Multi-user**: Proper separation of duties
- ✨ **Professional**: Enterprise-grade access control

## 🚦 Status Indicators

The sidebar now shows:

```
📋 Menu
┌─────────────┐
│ MANUFACTURER│  ← Your current role
└─────────────┘
📊 Dashboard
📦 Add Product
🎯 Assign Workers
...
```

## 🔄 Role Change Flow

```
1. Connect Wallet
   ↓
2. System Checks:
   - Is this the owner address?
   - Is this a registered worker?
   - What's the worker's role?
   ↓
3. Display Appropriate Menu
   ↓
4. User Interacts with Allowed Features
```

---

**Your PharmaDApp now has enterprise-grade role-based access control! 🎉**
