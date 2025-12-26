# Test Data Examples for Performance System

## Overview

This document provides realistic test data to demonstrate the performance-based assignment system effectively.

## Test Workers Setup

### Distributors

#### Worker #1: ColdChain Pro (Excellent Performer)
```javascript
{
  name: "ColdChain Pro",
  role: 1, // DISTRIBUTOR
  walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
}
```
**Expected Performance**: Score 90-95

#### Worker #2: ABC Distribution (Good Performer)
```javascript
{
  name: "ABC Distribution",
  role: 1, // DISTRIBUTOR
  walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
}
```
**Expected Performance**: Score 75-85

#### Worker #3: QuickFreeze Inc (Fair Performer)
```javascript
{
  name: "QuickFreeze Inc",
  role: 1, // DISTRIBUTOR
  walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
}
```
**Expected Performance**: Score 60-70

#### Worker #4: Budget Cold Storage (Poor Performer)
```javascript
{
  name: "Budget Cold Storage",
  role: 1, // DISTRIBUTOR
  walletAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
}
```
**Expected Performance**: Score 40-55

### Transporters

#### Worker #5: ReliableTransport (Excellent)
```javascript
{
  name: "ReliableTransport",
  role: 2, // TRANSPORTER
  walletAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
}
```

#### Worker #6: FastShip Logistics (Good)
```javascript
{
  name: "FastShip Logistics",
  role: 2, // TRANSPORTER
  walletAddress: "0x976EA74026E726554dB657fA54763abd0C3a0aa9"
}
```

#### Worker #7: Economy Transport (Fair)
```javascript
{
  name: "Economy Transport",
  role: 2, // TRANSPORTER
  walletAddress: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"
}
```

## Test Products Setup

### Product #1: COVID-19 Vaccine (High Sensitivity)
```javascript
{
  name: "COVID-19 mRNA Vaccine",
  description: "Requires ultra-cold storage",
  minTemp: -80,
  maxTemp: -60,
  quantity: 1000,
  mfgDate: "2024-12-01"
}
```

### Product #2: Insulin (Medium Sensitivity)
```javascript
{
  name: "Insulin Vials",
  description: "Temperature sensitive medication",
  minTemp: 2,
  maxTemp: 8,
  quantity: 500,
  mfgDate: "2024-12-15"
}
```

### Product #3: Vitamin Supplements (Low Sensitivity)
```javascript
{
  name: "Vitamin D Supplements",
  description: "Room temperature storage",
  minTemp: 15,
  maxTemp: 25,
  quantity: 2000,
  mfgDate: "2024-12-20"
}
```

### Product #4: Cancer Treatment Drug (High Sensitivity)
```javascript
{
  name: "Chemotherapy Drug XYZ",
  description: "Critical temperature control",
  minTemp: 2,
  maxTemp: 8,
  quantity: 100,
  mfgDate: "2024-12-10"
}
```

## Test Status Updates

### Scenario 1: ColdChain Pro (Excellent Performance)

#### Product #1 Handling (Perfect)
```javascript
// Update 1
{
  productId: 0,
  location: "Warehouse A",
  temperature: -70, // In range: -80 to -60
  quantity: 1000
}

// Update 2
{
  productId: 0,
  location: "Storage Facility B",
  temperature: -72, // In range
  quantity: 1000
}

// Update 3
{
  productId: 0,
  location: "Distribution Center",
  temperature: -68, // In range
  quantity: 1000
}
// Result: NOT SPOILED ✓
```

#### Product #2 Handling (Perfect)
```javascript
// Update 1
{
  productId: 1,
  location: "Cold Room 1",
  temperature: 4, // In range: 2 to 8
  quantity: 500
}

// Update 2
{
  productId: 1,
  location: "Cold Room 2",
  temperature: 5, // In range
  quantity: 500
}

// Update 3
{
  productId: 1,
  location: "Ready for Transport",
  temperature: 6, // In range
  quantity: 500
}
// Result: NOT SPOILED ✓
```

**ColdChain Pro Summary**:
- Shipments: 2
- Successful: 2
- Temp Checks: 6
- Violations: 0
- Expected Score: ~100

### Scenario 2: ABC Distribution (Good Performance)

#### Product #3 Handling (Perfect)
```javascript
// All temperatures in range (15-25°C)
{
  productId: 2,
  location: "Warehouse",
  temperature: 20,
  quantity: 2000
}
{
  productId: 2,
  location: "Storage",
  temperature: 22,
  quantity: 2000
}
// Result: NOT SPOILED ✓
```

#### Product #4 Handling (1 Violation, but saved)
```javascript
// Update 1
{
  productId: 3,
  location: "Receiving",
  temperature: 4, // In range: 2 to 8
  quantity: 100
}

// Update 2 (VIOLATION but caught early)
{
  productId: 3,
  location: "Storage",
  temperature: 10, // OUT OF RANGE (>8)
  quantity: 100
}

// Update 3 (Corrected)
{
  productId: 3,
  location: "Cold Storage",
  temperature: 5, // Back in range
  quantity: 100
}
// Result: NOT SPOILED ✓ (caught and corrected in time)
```

**ABC Distribution Summary**:
- Shipments: 2
- Successful: 2
- Temp Checks: 5
- Violations: 1
- Expected Score: ~88

### Scenario 3: QuickFreeze Inc (Fair Performance)

#### Product #1 Handling (Multiple Violations)
```javascript
{
  productId: 0,
  location: "Warehouse",
  temperature: -55, // OUT OF RANGE (-80 to -60)
  quantity: 1000
}
{
  productId: 0,
  location: "Storage",
  temperature: -58, // OUT OF RANGE
  quantity: 1000
}
{
  productId: 0,
  location: "Distribution",
  temperature: -62, // In range
  quantity: 1000
}
// Result: NOT SPOILED ✓ (barely saved)
```

#### Product #2 Handling (SPOILED)
```javascript
{
  productId: 1,
  location: "Warehouse",
  temperature: 4, // In range
  quantity: 500
}
{
  productId: 1,
  location: "Storage",
  temperature: 15, // OUT OF RANGE (>8) - MAJOR VIOLATION
  quantity: 500
}
{
  productId: 1,
  location: "Attempting Recovery",
  temperature: 6, // Too late
  quantity: 500
}
// Result: SPOILED ✗
```

**QuickFreeze Inc Summary**:
- Shipments: 2
- Successful: 1
- Spoiled: 1
- Temp Checks: 6
- Violations: 3
- Expected Score: ~58

### Scenario 4: Budget Cold Storage (Poor Performance)

#### Product #4 Handling (SPOILED immediately)
```javascript
{
  productId: 3,
  location: "Warehouse",
  temperature: 20, // OUT OF RANGE (2-8) - CRITICAL FAILURE
  quantity: 100
}
// Result: SPOILED ✗ immediately
```

#### Product #3 Handling (Multiple violations)
```javascript
{
  productId: 2,
  location: "Warehouse",
  temperature: 30, // OUT OF RANGE (15-25)
  quantity: 2000
}
{
  productId: 2,
  location: "Storage",
  temperature: 28, // OUT OF RANGE
  quantity: 2000
}
{
  productId: 2,
  location: "Distribution",
  temperature: 26, // OUT OF RANGE
  quantity: 2000
}
// Result: SPOILED ✗
```

**Budget Cold Storage Summary**:
- Shipments: 2
- Successful: 0
- Spoiled: 2
- Temp Checks: 4
- Violations: 4
- Expected Score: ~0

## Expected Rankings After Test Data

After entering all test data, rankings should show:

### Distributors
```
🥇 #1 ColdChain Pro          Score: 100  ⭐ Excellent
   ✅ Success: 100%  🌡️ Compliance: 100%
   📦 2 shipments  ❌ 0 spoiled

🥈 #2 ABC Distribution       Score: 88   👍 Good
   ✅ Success: 100%  🌡️ Compliance: 80%
   📦 2 shipments  ❌ 0 spoiled

🥉 #3 QuickFreeze Inc        Score: 58   ⚠️ Fair
   ✅ Success: 50%   🌡️ Compliance: 50%
   📦 2 shipments  ❌ 1 spoiled

4️⃣ Budget Cold Storage      Score: 0    🚨 Poor
   ✅ Success: 0%    🌡️ Compliance: 0%
   📦  2 shipments  ❌ 2 spoiled
```

## Testing Scenarios

### Scenario A: Assign Sensitive Product
```
Product: COVID-19 Vaccine (-80 to -60°C)
Action: Go to "Assign Workers" → Select "Distributor"
Filter: Min Score 90+
Expected: Only ColdChain Pro shows
Decision: Assign to ColdChain Pro ✓
```

### Scenario B: Assign Standard Product
```
Product: Insulin (2-8°C)
Action: Go to "Assign Workers" → Select "Distributor"
Filter: Min Score 75+
Expected: ColdChain Pro and ABC Distribution show
Decision: Either is acceptable, ColdChain Pro is better
```

### Scenario C: View Poor Performer Profile
```
Worker: Budget Cold Storage
Action: Click "View Profile" from rankings
Expected Insights:
- 🚨 Performance needs significant improvement
- ❌ 100% spoilage rate indicates serious issues
- 🌡️ Temperature compliance is critically low
```

## API Test Commands

```bash
# Get ColdChain Pro performance (should be ~100)
curl http://localhost:8000/performance/worker/1

# Get all distributor rankings
curl "http://localhost:8000/performance/rankings?role=DISTRIBUTOR"

# Get recommendations for vaccine (should prioritize ColdChain Pro)
curl "http://localhost:8000/performance/recommendations/distributor/0?min_score=90"

# Compare top 3 distributors
curl "http://localhost:8000/performance/comparison?worker_ids=1,2,3"
```

## Expected API Responses

### Worker Performance (ColdChain Pro)
```json
{
  "worker_id": 1,
  "worker_name": "ColdChain Pro",
  "worker_role": "DISTRIBUTOR",
  "total_shipments_handled": 2,
  "successful_shipments": 2,
  "spoiled_shipments": 0,
  "success_rate": 100.0,
  "total_temp_checks": 6,
  "out_of_range_readings": 0,
  "temp_compliance_rate": 100.0,
  "performance_score": 100.0,
  "products_handled": [0, 1],
  "recent_temperatures": [...]
}
```

### Rankings Response
```json
{
  "total_workers": 4,
  "filters": {
    "role": "DISTRIBUTOR",
    "min_shipments": 0,
    "min_score": 0.0
  },
  "rankings": [
    {
      "worker_id": 1,
      "name": "ColdChain Pro",
      "role": "DISTRIBUTOR",
      "performance_score": 100.0,
      "success_rate": 100.0,
      "temp_compliance_rate": 100.0,
      "total_shipments": 2,
      "spoiled_shipments": 0
    },
    {
      "worker_id": 2,
      "name": "ABC Distribution",
      "role": "DISTRIBUTOR",
      "performance_score": 88.0,
      ...
    }
  ]
}
```

## Step-by-Step Test Execution

### Phase 1: Setup (5 minutes)
1. Start blockchain: `npx hardhat node`
2. Deploy contract: `npx hardhat run scripts/deploy.js --network localhost`
3. Start backend: `uvicorn main:app --reload`
4. Start frontend: `npm start`

### Phase 2: Add Workers (5 minutes)
1. Register all 7 workers using "Add Worker" form
2. Verify in blockchain console that workers are registered

### Phase 3: Add Products (5 minutes)
1. Create 4 test products using "Add Product" form
2. Note the product IDs assigned

### Phase 4: Create Performance History (15 minutes)
1. Follow scenarios 1-4 above
2. Add status updates for each worker
3. Use "Update Status" form with exact temperatures listed

### Phase 5: Verify Rankings (5 minutes)
1. Navigate to "Performance Rankings"
2. Verify workers are ranked as expected
3. Click "View Profile" on each to see details

### Phase 6: Test Assignment (5 minutes)
1. Navigate to "Assign Workers"
2. Try different filters
3. Select workers and confirm assignments work

### Total Time: ~35 minutes

## Validation Checklist

- [ ] All 7 workers registered successfully
- [ ] All 4 products created successfully
- [ ] Status updates recorded for all scenarios
- [ ] Rankings show correct order
- [ ] Performance scores match expectations
- [ ] Filters work correctly
- [ ] Worker profiles display all metrics
- [ ] Smart assignment shows ranked recommendations
- [ ] Budget Cold Storage shows "Poor" rating
- [ ] ColdChain Pro shows "Excellent" rating

## Troubleshooting Test Data

### If scores don't match expectations:
1. Verify all status updates were recorded
2. Check product temperature ranges are correct
3. Ensure worker IDs match in status updates
4. Refresh the rankings page

### If rankings are empty:
1. Confirm workers have handled at least one product
2. Check backend logs for errors
3. Verify contract address is correct
4. Ensure blockchain is running

---

**Use this test data to demonstrate the full capability of the performance system!** 🧪
