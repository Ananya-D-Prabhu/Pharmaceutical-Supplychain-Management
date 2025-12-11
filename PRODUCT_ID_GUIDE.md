# Product ID Reference Guide

## What is a Product ID?

The **Product ID** is a unique number automatically assigned by the smart contract when a product is added to the blockchain. It starts from `0` and increments by 1 for each new product.

- First product: ID = `0`
- Second product: ID = `1`
- Third product: ID = `2`
- And so on...

## How to Get the Product ID

### Method 1: After Adding a Product ✅ EASIEST

When you add a product using the "Add Product" form:

1. Fill in the product details (name, description, temperature, manufacturing date)
2. Click "Add Product" and confirm the MetaMask transaction
3. After successful transaction, the **Product ID will be displayed** in a large purple badge
4. **Click on the Product ID badge** to copy it to your clipboard
5. Use this ID when updating status

**Example Display:**
```
✅ Product added successfully! Product ID: 0

Use this Product ID to update status:
┌──────────────────────────────┐
│   0           📋 Click to copy│
└──────────────────────────────┘
```

### Method 2: View Products Page 📋

A new page has been added to view all products with their IDs:

1. Click on **"📋 View Products"** in the sidebar
2. You'll see all products listed with their details
3. Each product card shows the **Product ID** in the top-right corner
4. Click on the Product ID badge to copy it

**Product Card Example:**
```
┌─────────────────────────────────────────┐
│ Aspirin 500mg              ID: 0  📋    │
├─────────────────────────────────────────┤
│ 📝 Description: Pain relief medication  │
│ 🌡️ Required Temp: 2-8°C                │
│ 📅 Mfg Date: 2025-12-10                 │
│ ⏰ Created: 12/10/2025, 10:30 AM        │
├─────────────────────────────────────────┤
│      [📋 Copy ID]                       │
└─────────────────────────────────────────┘
```

### Method 3: Using Product History

When you view a product's history:

1. Go to "🔍 Track Product"
2. Enter a Product ID to see its tracking history
3. The timeline will show all status updates for that product

## How to Use the Product ID

### When Updating Product Status

1. **Get the Product ID** using Method 1 or 2 above
2. Go to **"📝 Update Status"** page
3. Paste or type the **Product ID** in the first field
4. Fill in the other required fields:
   - Location (e.g., "Mumbai Warehouse")
   - Temperature (e.g., "5°C")
   - Humidity (e.g., "60%")
   - Heat Index (e.g., "25")
   - Quantity (e.g., "100")
   - Quality Maintained (Yes/No)
5. Submit the transaction via MetaMask

## Important Notes

⚠️ **Product ID Requirements:**
- The Product ID must **exist** (must have been added before)
- Product IDs start from `0`, not `1`
- You can only update status for products that have been created
- If you enter an invalid ID, you'll get error: "PRODUCT DOES NOT EXIST"

📝 **Role Requirements:**
- **Adding Products**: Only Manufacturers (registered workers with Manufacturer role)
- **Updating Status**: Only Distributors or Transporters (registered workers)
- **Viewing Products**: Anyone can view (no registration required)

## Workflow Example

### Complete Flow from Adding to Tracking:

1. **Register as Manufacturer** (using Owner account)
   - Owner registers your address via "Add Worker"
   - Role: Manufacturer

2. **Add a Product** (switch to Manufacturer account)
   - Name: "Amoxicillin 250mg"
   - Description: "Antibiotic capsules"
   - Required Temp: "15-25°C"
   - Mfg Date: "2025-12-10"
   - **Result: Product ID = 0** (displayed after success)

3. **Copy the Product ID**
   - Click on the purple badge showing "0"
   - ID copied to clipboard

4. **Register as Distributor** (using Owner account)
   - Owner registers distributor address via "Add Worker"
   - Role: Distributor

5. **Update Status** (switch to Distributor account)
   - Product ID: `0` (paste the copied ID)
   - Location: "Delhi Distribution Center"
   - Temperature: "20°C"
   - Humidity: "55%"
   - Heat Index: "23"
   - Quantity: "500"
   - Quality Maintained: Yes
   - **Transaction succeeds!**

6. **View History**
   - Go to "Track Product"
   - Enter Product ID: `0`
   - See complete timeline of all updates

## Troubleshooting

### "PRODUCT DOES NOT EXIST"
- **Cause**: Invalid Product ID or product not yet created
- **Solution**: 
  - Check the Product ID in "View Products" page
  - Make sure the product was successfully added
  - Product IDs start from 0, not 1

### "NOT A REGISTERED WORKER"
- **Cause**: Your account is not registered or doesn't have the right role
- **Solution**: 
  - For adding products: Must be registered as Manufacturer
  - For updating status: Must be registered as Distributor or Transporter
  - Use Owner account to register workers first

### Can't Find Product ID
- **Solution 1**: Go to "View Products" page - all products listed with IDs
- **Solution 2**: Check browser console logs after adding product
- **Solution 3**: Look at the success message after adding product

## Quick Reference

| Action | Required Role | Where to Get Product ID |
|--------|--------------|------------------------|
| Add Product | Manufacturer | N/A (ID created after adding) |
| Update Status | Distributor/Transporter | "View Products" or after adding |
| View History | Anyone | "View Products" or remember from adding |
| View All Products | Anyone | Sidebar: "📋 View Products" |

---

**Pro Tip**: Always note down the Product ID immediately after adding a product, or bookmark the "View Products" page for easy reference!
