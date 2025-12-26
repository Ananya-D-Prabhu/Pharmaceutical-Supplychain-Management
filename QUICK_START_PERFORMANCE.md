# Quick Start Guide - Performance-Based Assignment System

## What's Been Implemented

✅ **Backend Performance Tracking**
- 6 new API endpoints for performance metrics
- Automatic calculation from blockchain data
- Worker rankings and recommendations
- Comparison tools

✅ **Frontend Components**
- Worker Profile modal with detailed metrics
- Smart Assignment interface with filtering
- Performance Rankings leaderboard
- Assignment interface for manufacturers/distributors

✅ **Navigation Integration**
- "🏆 Performance Rankings" menu item
- "🎯 Assign Workers" menu item

## How to Use

### Step 1: Start Your Services

```bash
# Terminal 1 - Start blockchain (if using Hardhat)
cd e:\PharmaDApp
npx hardhat node

# Terminal 2 - Start backend
cd e:\PharmaDApp\backend
uvicorn main:app --reload

# Terminal 3 - Start frontend
cd e:\PharmaDApp\frontend
npm start
```

### Step 2: Add Test Data

For the performance system to work, you need:

1. **Workers** - Register at least 2-3 workers per role
   - Go to "👤 Add Worker"
   - Add distributors and transporters

2. **Products** - Create some products
   - Go to "📦 Add Product"
   - Set temperature requirements

3. **Status Updates** - Create tracking history
   - Go to "📝 Update Status"
   - Add temperature readings for products
   - Try some in-range and some out-of-range to test scoring

### Step 3: View Performance

Navigate to "🏆 Performance Rankings" to see:
- All workers ranked by performance
- Filter by role, score, experience
- Click "View Profile" for detailed analysis

### Step 4: Assign Workers

Navigate to "🎯 Assign Workers" to:
1. Enter a product ID
2. Select distributor or transporter
3. See ranked recommendations based on performance
4. Apply filters (min score 75+, experienced workers, etc.)
5. View detailed profiles
6. Select and assign

## Testing the System

### Create a Performance Scenario

```javascript
// Worker A: Good Performance (should score ~90+)
- 10 shipments
- All temperatures in range
- 0 spoiled products

// Worker B: Average Performance (should score ~75)
- 10 shipments
- 2-3 out-of-range readings
- 1 spoiled product

// Worker C: Poor Performance (should score ~50)
- 5 shipments
- Many out-of-range readings
- 2-3 spoiled products
```

After creating this data, check:
1. Performance Rankings - Workers should be sorted correctly
2. Worker Profiles - Scores should reflect their performance
3. Smart Assignment - Top performers appear first

## API Endpoints Reference

All endpoints are at `http://localhost:8000`

```bash
# Get specific worker performance
GET /performance/worker/1

# Get all rankings
GET /performance/rankings

# Filter rankings
GET /performance/rankings?role=DISTRIBUTOR&min_score=75&min_shipments=10

# Get distributor recommendations for product
GET /performance/recommendations/distributor/5?min_score=80&top_n=3

# Get transporter recommendations
GET /performance/recommendations/transporter/5

# Compare workers
GET /performance/comparison?worker_ids=1,2,3
```

## Performance Score Breakdown

```
Performance Score = (Success Rate × 0.7) + (Temp Compliance × 0.3)

Success Rate = (Successful Shipments / Total Shipments) × 100
Temp Compliance = (In-Range Readings / Total Readings) × 100

Categories:
- 90-100: ⭐ Excellent (Green)
- 75-89:  👍 Good (Yellow)
- 60-74:  ⚠️ Fair (Orange)
- 0-59:   🚨 Poor (Red)
```

## Features Highlight

### 1. Smart Filtering
- **Minimum Score**: Show only workers above threshold
- **Minimum Experience**: Require certain number of shipments
- **Role Filter**: Distributors, Transporters, or all
- **Sort Options**: Performance, Success Rate, Experience

### 2. Worker Profiles
- Overall performance score with visual indicator
- All-time vs Recent performance toggle
- Detailed metrics grid (8 key metrics)
- Recent temperature records
- AI-generated insights

### 3. Assignment Recommendations
- Product-specific recommendations
- Pre-filtered by minimum score
- Top N performers
- Quick profile access
- Visual performance indicators

## Workflow Example

### Manufacturer Assigning Distributor

```
1. Manufacturer creates Product #5 (Vaccine, requires 2-8°C)
2. Goes to "🎯 Assign Workers"
3. Enters Product ID: 5
4. Selects "Distributor"
5. Clicks "Select Best Distributor"
6. System shows:
   - #1 John's Cold Chain (Score: 95, 30 shipments)
   - #2 ABC Distribution (Score: 88, 15 shipments)
   - #3 FastCold Ltd (Score: 82, 8 shipments)
7. Manufacturer applies filter: "Min Score: 90"
8. Now only John's Cold Chain shows
9. Views John's profile - sees excellent temp compliance
10. Selects John's Cold Chain
11. Assignment confirmed
```

### Distributor Assigning Transporter

```
1. Distributor receives Product #5
2. Goes to "🎯 Assign Workers"
3. Enters Product ID: 5
4. Selects "Transporter"
5. Reviews recommendations sorted by performance
6. Filters for "10+ shipments" experience
7. Compares top 3 transporters' profiles
8. Selects highest-rated transporter
9. Assignment confirmed
```

## Customization Tips

### Adjust Performance Weights

Edit `backend/routers/performance.py`:

```python
# Current: 70% success rate, 30% temp compliance
performance_score = (0.7 * success_rate + 0.3 * temp_compliance_rate)

# Example: Equal weight
performance_score = (0.5 * success_rate + 0.5 * temp_compliance_rate)

# Example: Prioritize temp compliance (for sensitive products)
performance_score = (0.4 * success_rate + 0.6 * temp_compliance_rate)
```

### Change Default Filters

Edit frontend components:

```javascript
// In SmartAssignment.jsx or PerformanceRankings.jsx
const [filters, setFilters] = useState({
  minScore: 75,      // Only show "Good" or better
  minShipments: 10,  // Require experience
  sortBy: "performance_score"
});
```

### Modify Score Thresholds

```javascript
// In getScoreLabel or getScoreColor functions
const getScoreLabel = (score) => {
  if (score >= 95) return "Excellent";    // Stricter
  if (score >= 85) return "Very Good";    // New tier
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Improvement";
};
```

## Troubleshooting

### No workers showing in rankings
**Solution**: Register workers via "👤 Add Worker" first

### All performance scores are 0
**Solution**: Workers need to handle products first. Add status updates via "📝 Update Status"

### Backend API errors
**Solution**: 
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend can't connect to backend
**Solution**: Verify API_URL in components:
```javascript
const API_URL = "http://localhost:8000";
```

### Performance calculations seem wrong
**Solution**: Check that status updates have the correct format and that product temperature ranges are set properly

## Next Steps

1. **Test with Real Data**: Add actual workers and products
2. **Monitor Performance**: Use rankings to track workers over time
3. **Refine Filters**: Adjust minimum thresholds for your needs
4. **Implement On-Chain**: Later, move assignment logic to smart contract
5. **Add Notifications**: Alert workers about their performance
6. **Create Reports**: Export performance data for analysis

## Support

For detailed documentation, see:
- [PERFORMANCE_SYSTEM_GUIDE.md](PERFORMANCE_SYSTEM_GUIDE.md) - Complete documentation
- Backend: `backend/routers/performance.py`
- Frontend Components: `frontend/src/components/`
  - WorkerProfile.jsx
  - SmartAssignment.jsx
  - PerformanceRankings.jsx
  - AssignProduct.jsx

---

**Ready to Use!** 🚀

Start by adding some test workers and products, then watch the performance system automatically track and rank them based on their temperature maintenance quality!
