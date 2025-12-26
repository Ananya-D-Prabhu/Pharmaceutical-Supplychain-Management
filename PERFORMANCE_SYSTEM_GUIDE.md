# Performance-Based Worker Assignment System

## Overview

This implementation adds an off-chain performance tracking and smart assignment system to PharmaDApp. The system allows manufacturers and distributors to make data-driven decisions when assigning distributors and transporters based on their historical performance.

## Architecture

### Backend (FastAPI)

**New Router: `performance.py`**

Located at: `backend/routers/performance.py`

#### Key Endpoints:

1. **GET `/performance/worker/{worker_id}`**
   - Returns comprehensive performance metrics for a specific worker
   - Parameters:
     - `worker_id`: Worker ID to query
     - `recent_only` (optional): Focus on recent performance only
     - `limit` (optional): Number of recent records to analyze
   - Response includes:
     - Total shipments handled
     - Success rate (% non-spoiled)
     - Temperature compliance rate
     - Overall performance score
     - Recent temperature records

2. **GET `/performance/rankings`**
   - Returns ranked list of all workers with performance scores
   - Parameters:
     - `role` (optional): Filter by MANUFACTURER, DISTRIBUTOR, or TRANSPORTER
     - `min_shipments` (optional): Minimum experience threshold
     - `min_score` (optional): Minimum performance score
   - Sorted by performance score (descending)

3. **GET `/performance/recommendations/distributor/{product_id}`**
   - Get top recommended distributors for a specific product
   - Parameters:
     - `product_id`: Product to assign
     - `min_score` (default 70.0): Minimum acceptable score
     - `top_n` (default 5): Number of recommendations
   - Returns product details and ranked distributors

4. **GET `/performance/recommendations/transporter/{product_id}`**
   - Same as distributor recommendations, but for transporters

5. **GET `/performance/comparison`**
   - Compare performance of multiple workers side-by-side
   - Parameters:
     - `worker_ids`: Comma-separated worker IDs (e.g., "1,2,3")
   - Returns detailed comparison and identifies best performer

### Performance Calculation Logic

The system calculates performance based on:

1. **Success Rate** (70% weight)
   - Formula: `(successful_shipments / total_shipments) × 100`
   - A shipment is successful if the product didn't end up spoiled

2. **Temperature Compliance Rate** (30% weight)
   - Formula: `(in_range_readings / total_readings) × 100`
   - Tracks how often temperatures stayed within acceptable range

3. **Overall Performance Score**
   - Formula: `(0.7 × success_rate) + (0.3 × temp_compliance_rate)`
   - Range: 0-100
   - Categories:
     - 90-100: Excellent ⭐
     - 75-89: Good 👍
     - 60-74: Fair ⚠️
     - 0-59: Poor 🚨

### Frontend Components

#### 1. **WorkerProfile.jsx**
- Modal component displaying detailed worker performance
- Features:
  - Performance score with visual indicators
  - Toggle between all-time and recent performance
  - Comprehensive metrics grid
  - Recent temperature history
  - AI-generated insights based on performance

#### 2. **SmartAssignment.jsx**
- Modal for selecting workers based on performance
- Features:
  - Real-time performance filtering
  - Sortable rankings
  - Quick profile access
  - Visual performance indicators
  - Selected worker confirmation

#### 3. **PerformanceRankings.jsx**
- Full-page view of all worker rankings
- Features:
  - Leaderboard with medal badges (🥇🥈🥉)
  - Advanced filtering options
  - Statistical summary cards
  - Performance score visualization bars
  - Quick access to detailed profiles

#### 4. **AssignProduct.jsx**
- Interface for manufacturers/distributors to assign workers
- Features:
  - Product ID input
  - Role selection (distributor/transporter)
  - Smart worker selection
  - Assignment confirmation
  - Educational info cards

## Usage Flow

### For Manufacturers (Assigning Distributors)

1. Navigate to "🎯 Assign Workers"
2. Enter the Product ID
3. Select "Distributor" as assignment type
4. Click "Select Best Distributor"
5. Review ranked distributors with:
   - Performance scores
   - Success rates
   - Temperature compliance
   - Experience levels
6. Apply filters if needed:
   - Minimum score (e.g., only 75+ rated workers)
   - Minimum experience (e.g., at least 10 shipments)
   - Sort by different metrics
7. View detailed profiles by clicking "View Profile"
8. Select desired distributor
9. Confirm assignment

### For Distributors (Assigning Transporters)

Same process as manufacturers, but selecting "Transporter" role.

### Viewing Performance Rankings

1. Navigate to "🏆 Performance Rankings"
2. View leaderboard of all workers
3. Apply filters to narrow down:
   - By role (Manufacturer/Distributor/Transporter)
   - By minimum score
   - By minimum experience
4. Click "View Profile" on any worker for detailed analysis

### Viewing Individual Performance

1. From any worker selection or ranking view
2. Click "View Profile" or "👤 View Profile" button
3. Modal opens with:
   - Overall performance score
   - Detailed metrics
   - Recent temperature records
   - Performance insights and recommendations

## Data Flow

```
Blockchain (Smart Contract)
    ↓
Backend Reads Events & Data
    ↓
Performance Calculations
    ↓
Rankings & Recommendations
    ↓
Frontend Display & Filtering
    ↓
User Selection
    ↓
Assignment (back to blockchain)
```

## Key Features

### 1. **Real-Time Performance Tracking**
- Automatically calculates performance from blockchain data
- No manual updates needed
- Tamper-proof source of truth

### 2. **Smart Filtering**
- Filter by role, experience, score
- Sort by multiple criteria
- Find the best match for specific needs

### 3. **Transparency**
- All metrics visible to decision-makers
- Historical performance trends
- Recent vs. all-time comparison

### 4. **Data-Driven Decisions**
- Remove bias from selection process
- Objective performance metrics
- Evidence-based assignments

### 5. **Performance Incentives**
- Workers can see their own performance
- Creates competition for better service
- Rewards consistent quality maintenance

## Configuration

### Adjusting Performance Weights

In `backend/routers/performance.py`, line ~104:

```python
performance_score = (0.7 * success_rate + 0.3 * temp_compliance_rate)
```

Adjust the weights (0.7 and 0.3) to prioritize different metrics:
- Higher success_rate weight: Focus on preventing spoilage
- Higher temp_compliance: Focus on consistent temperature maintenance

### Changing Score Categories

In frontend components (WorkerProfile.jsx, SmartAssignment.jsx):

```javascript
const getScoreLabel = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Improvement";
};
```

Adjust thresholds as needed for your standards.

### Default Filters

In `AssignProduct.jsx` or `PerformanceRankings.jsx`, modify initial filter state:

```javascript
const [filters, setFilters] = useState({
  minScore: 0,      // Change to 70 to only show good performers
  minShipments: 0,  // Change to 5 to require experience
  sortBy: "performance_score"
});
```

## API Examples

### Get Worker Performance

```bash
curl http://localhost:8000/performance/worker/1
```

Response:
```json
{
  "worker_id": 1,
  "worker_name": "John's Distribution",
  "worker_role": "DISTRIBUTOR",
  "total_shipments_handled": 25,
  "successful_shipments": 23,
  "spoiled_shipments": 2,
  "success_rate": 92.0,
  "total_temp_checks": 150,
  "out_of_range_readings": 8,
  "temp_compliance_rate": 94.67,
  "performance_score": 92.8,
  "products_handled": [1, 3, 5, 7, 9, ...],
  "recent_temperatures": [...]
}
```

### Get Rankings

```bash
curl "http://localhost:8000/performance/rankings?role=DISTRIBUTOR&min_score=75&min_shipments=10"
```

### Get Recommendations

```bash
curl http://localhost:8000/performance/recommendations/distributor/5?min_score=80&top_n=3
```

## Benefits

### For Manufacturers
- Select the most reliable distributors
- Reduce spoilage rates
- Data-driven partner selection
- Track performance over time

### For Distributors
- Choose best transporters
- Improve their own performance visibility
- Build reputation through consistent quality
- Access to performance insights

### For the Supply Chain
- Increased accountability
- Improved temperature compliance
- Reduced waste from spoilage
- Quality-based competition

## Future Enhancements

1. **Time-Series Performance Analysis**
   - Track performance trends over time
   - Identify improving vs. declining workers
   - Seasonal performance patterns

2. **Product Category Specialization**
   - Track performance by product type
   - Recommend specialists (e.g., vaccines, medications)
   - Different scoring for different product categories

3. **Performance Alerts**
   - Notify when worker performance drops
   - Alert on consistent violations
   - Congratulate exceptional performance

4. **Predictive Analytics**
   - Predict likelihood of successful delivery
   - Risk scoring for assignments
   - ML-based recommendations

5. **Reputation NFTs**
   - Award badges for milestones
   - Non-transferable achievement tokens
   - Gamification of performance

## Testing

### Test Scenario 1: View Worker Performance
1. Ensure blockchain is running with test data
2. Navigate to Performance Rankings
3. Verify workers are listed with scores
4. Click "View Profile" on a worker
5. Confirm all metrics display correctly

### Test Scenario 2: Smart Assignment
1. Navigate to "Assign Workers"
2. Enter a valid product ID
3. Click "Select Best Distributor"
4. Verify workers load with performance data
5. Apply filters and confirm filtering works
6. Select a worker and confirm selection

### Test Scenario 3: Performance Calculation
1. Create products and status updates
2. Deliberately create out-of-range temperatures
3. Check performance API
4. Verify scores reflect the violations

## Troubleshooting

### Issue: Performance scores show 0
- **Cause**: No status updates recorded yet
- **Solution**: Workers need to handle at least one shipment

### Issue: Rankings empty
- **Cause**: Filters too restrictive or no workers registered
- **Solution**: Adjust filters or register workers first

### Issue: API errors
- **Cause**: Backend not running or contract not deployed
- **Solution**: Start backend with `uvicorn main:app --reload`

### Issue: Frontend not loading data
- **Cause**: CORS issues or incorrect API URL
- **Solution**: Verify API_URL in components matches backend

## Conclusion

This off-chain performance system provides a practical, scalable way to implement performance-based worker assignment without modifying the smart contract. It leverages existing blockchain data to compute meaningful metrics and presents them through an intuitive UI, enabling data-driven decisions while maintaining the integrity of the blockchain as the source of truth.
