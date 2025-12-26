# 🚀 Quick Reference Card - Performance System

## 📍 Navigation

```
Main Menu → 🏆 Performance Rankings  (View all worker performance)
Main Menu → 🎯 Assign Workers        (Smart worker assignment)
```

## 🎯 Quick Actions

### View Worker Rankings
1. Click **"🏆 Performance Rankings"**
2. See leaderboard sorted by performance
3. Click any **"View Profile"** for details

### Assign a Worker
1. Click **"🎯 Assign Workers"**
2. Enter **Product ID**
3. Select **Distributor** or **Transporter**
4. Click **"Select Best..."**
5. Review ranked list
6. Click **"View Profile"** to see details
7. Select worker → **"Assign"**

### Filter Workers
In rankings or assignment:
- **Min Score**: 60+ / 75+ / 90+
- **Min Experience**: 5+ / 10+ / 20+ shipments
- **Role**: Manufacturer / Distributor / Transporter
- **Sort By**: Performance / Success / Experience

## 📊 Understanding Scores

| Score | Label | Color | Meaning |
|-------|-------|-------|---------|
| 90-100 | ⭐ Excellent | 🟢 Green | Top performer, highly reliable |
| 75-89 | 👍 Good | 🟡 Yellow | Reliable, suitable for most jobs |
| 60-74 | ⚠️ Fair | 🟠 Orange | Acceptable, watch closely |
| 0-59 | 🚨 Poor | 🔴 Red | Needs improvement |

## 🧮 Score Formula

```
Performance Score = (Success Rate × 70%) + (Temp Compliance × 30%)

Success Rate = (Non-spoiled shipments / Total shipments) × 100
Temp Compliance = (In-range readings / Total readings) × 100
```

## 📋 Key Metrics

| Metric | What It Shows |
|--------|---------------|
| **Performance Score** | Overall quality (0-100) |
| **Success Rate** | % of shipments that didn't spoil |
| **Temp Compliance** | % of temperature readings in range |
| **Total Shipments** | Experience level |
| **Spoiled Shipments** | How many products went bad |
| **Temp Violations** | How many out-of-range readings |

## 🔌 API Endpoints

```bash
# Base URL
http://localhost:8000

# Get worker performance
GET /performance/worker/{worker_id}

# Get rankings
GET /performance/rankings
GET /performance/rankings?role=DISTRIBUTOR&min_score=75

# Get recommendations
GET /performance/recommendations/distributor/{product_id}
GET /performance/recommendations/transporter/{product_id}

# Compare workers
GET /performance/comparison?worker_ids=1,2,3
```

## 🎨 UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **PerformanceRankings** | Main view | Full leaderboard with filters |
| **WorkerProfile** | Modal | Detailed worker performance |
| **SmartAssignment** | Modal | Select worker for assignment |
| **AssignProduct** | Main view | Assignment interface |

## 🔥 Hot Keys & Tips

### Best Practices
✅ Always check worker profile before assigning
✅ Use min score filter (75+) for sensitive products
✅ Look for experience (10+ shipments) for high-value items
✅ Compare top 3 performers before final decision

### Common Workflows
```
New Product → Assign Distributor → Monitor Performance
Product Ready → Assign Transporter → Track Delivery
Weekly Review → Check Rankings → Identify Issues
```

## ⚙️ Configuration Files

| File | What to Edit |
|------|--------------|
| `backend/routers/performance.py` | Score calculation, weights |
| `frontend/src/components/SmartAssignment.jsx` | Default filters |
| `frontend/src/components/WorkerProfile.jsx` | Score thresholds |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No workers showing | Register workers first via "Add Worker" |
| All scores are 0 | Add status updates via "Update Status" |
| API errors | Check backend is running: `uvicorn main:app --reload` |
| Can't see rankings | Verify at least one worker has handled products |

## 📞 Quick Commands

```bash
# Start backend
cd backend && uvicorn main:app --reload

# Start frontend
cd frontend && npm start

# Start blockchain
npx hardhat node

# Check backend is running
curl http://localhost:8000/performance/rankings
```

## 🎓 Example Use Case

**Scenario**: Manufacturer has sensitive vaccine (2-8°C)

```
Step 1: Go to "🎯 Assign Workers"
Step 2: Enter Product ID: 15
Step 3: Select "Distributor"
Step 4: Set filters:
        - Min Score: 90 (Excellent only)
        - Min Shipments: 20 (Very experienced)
Step 5: System shows 2 eligible distributors:
        🥇 ColdChain Pro (Score: 95, 30 shipments)
        🥈 ReliableCold (Score: 92, 25 shipments)
Step 6: View ColdChain Pro profile:
        ✅ Success Rate: 98%
        🌡️ Temp Compliance: 96%
        💡 Excellent performer for vaccines
Step 7: Select ColdChain Pro
Step 8: Assign ✓
```

## 📈 Performance Tiers

| Tier | Criteria | Recommendation |
|------|----------|----------------|
| **Premium** | Score 90+, 20+ shipments | Assign all sensitive products |
| **Standard** | Score 75+, 10+ shipments | Most products, monitor closely |
| **Basic** | Score 60+, 5+ shipments | Non-critical items only |
| **Probation** | Score <60 | Training needed, avoid assignments |

## 🎯 Decision Matrix

| Product Type | Min Score | Min Shipments | Rationale |
|--------------|-----------|---------------|-----------|
| Vaccines | 90 | 20 | High sensitivity |
| Medications | 80 | 15 | Important compliance |
| Supplements | 70 | 10 | Standard care |
| General | 60 | 5 | Basic requirements |

## 💡 Pro Tips

1. **Check Recent Performance**: Toggle "Recent" in worker profile for current form
2. **Compare Multiple**: Use comparison API to analyze 3-4 candidates
3. **Set Standards**: Establish minimum scores per product category
4. **Monitor Trends**: Weekly check rankings to spot declining performance
5. **Reward Excellence**: Preferentially assign to top performers
6. **Support Improvement**: Identify struggling workers early

## 🚦 Status Indicators

| Icon | Meaning | Action |
|------|---------|--------|
| 🥇 🥈 🥉 | Top 3 performers | Prioritize for assignments |
| ⭐ | Excellent (90+) | Highly recommended |
| 👍 | Good (75-89) | Reliable choice |
| ⚠️ | Fair (60-74) | Use with caution |
| 🚨 | Poor (<60) | Avoid or retrain |

---

**Keep this card handy for quick reference!** 📌

Print or bookmark: `e:\PharmaDApp\QUICK_REFERENCE.md`
