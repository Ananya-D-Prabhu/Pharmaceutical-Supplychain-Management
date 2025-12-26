from fastapi import APIRouter, HTTPException
from contract import contract
from typing import List, Dict
from datetime import datetime

router = APIRouter(prefix="/performance")

def calculate_worker_performance(worker_id: int, recent_only: bool = False, limit: int = None) -> Dict:
    """
    Calculate comprehensive performance metrics for a worker
    """
    try:
        # Get worker info first to verify it exists
        worker = contract.functions.workers(worker_id).call()
        worker_address = worker[3]  # walletAddress field
        
        print(f"📊 Calculating performance for worker {worker_id} (address: {worker_address})")
        
        # Get product count by trying to call getProductCounter() first
        try:
            product_count = contract.functions.productCounter().call()
            print(f"📦 Product counter: {product_count}")
        except:
            # Fallback: scan products
            product_count = 0
            for i in range(100):
                try:
                    product = contract.functions.products(i).call()
                    if product[1]:  # name field is not empty
                        product_count = i + 1
                except:
                    break
            print(f"📦 Found {product_count} products by scanning")
        
        total_shipments = 0
        spoiled_shipments = 0
        total_temp_checks = 0
        out_of_range_readings = 0
        handled_products = set()
        temperature_records = []
        
        # Iterate through all products
        for i in range(product_count):
            try:
                product = contract.functions.products(i).call()
                product_name = product[1] if isinstance(product[1], str) else f"Product {i}"
                
                # Skip empty products
                if not product_name or product_name.strip() == "":
                    continue
                    
                print(f"  📦 Product {i}: {product_name}")
                
                try:
                    history = contract.functions.getProductHistory(i).call()
                    print(f"    📜 History length: {len(history)}")
                except Exception as e:
                    print(f"    ⚠️ Could not get history for product {i}: {e}")
                    history = []
                
                # Check if this worker was involved in handling this product
                worker_involved = False
                worker_temp_violations = 0
                worker_humidity_violations = 0
                
                for idx, status in enumerate(history):
                    # Status struct fields:
                    # 0: location, 1: temperature, 2: humidity, 3: workerId, 
                    # 4: productId, 5: quantity, 6: isSpoiled, 7: timestamp
                    
                    status_worker_id = status[3]  # workerId at index 3
                    
                    print(f"      Status {idx}: Worker={status_worker_id}, Temp={status[1]}, Humidity={status[2]}")
                    
                    if status_worker_id == worker_id:
                        worker_involved = True
                        total_temp_checks += 1
                        print(f"      ✅ Worker {worker_id} handled this!")
                        
                        # Extract readings and product constraints
                        temperature = status[1]  # temperature
                        humidity = status[2]  # humidity
                        min_temp = product[3]  # minTemp
                        max_temp = product[4]  # maxTemp
                        min_humidity = product[5]  # minHumidity
                        max_humidity = product[6]  # maxHumidity
                        timestamp = status[7]  # timestamp
                        
                        # Check temperature compliance
                        temp_in_range = min_temp <= temperature <= max_temp
                        
                        # Check humidity compliance
                        humidity_in_range = min_humidity <= humidity <= max_humidity
                        
                        temperature_records.append({
                            "product_id": i,
                            "temperature": temperature,
                            "humidity": humidity,
                            "min_temp": min_temp,
                            "max_temp": max_temp,
                            "min_humidity": min_humidity,
                            "max_humidity": max_humidity,
                            "timestamp": timestamp,
                            "temp_in_range": temp_in_range,
                            "humidity_in_range": humidity_in_range
                        })
                        
                        # Count violations
                        if not temp_in_range:
                            out_of_range_readings += 1
                            worker_temp_violations += 1
                        if not humidity_in_range:
                            out_of_range_readings += 1
                            worker_humidity_violations += 1
                
                if worker_involved:
                    handled_products.add(i)
                    total_shipments += 1
                    print(f"    ✅ Added to shipments. Total now: {total_shipments}")
                    
                    # Check if product ended up spoiled
                    # Product struct: 0:id, 1:name, 2:desc, 3:minTemp, 4:maxTemp, 
                    # 5:minHumid, 6:maxHumid, 7:qty, 8:mfgDate, 9:timestamp, 10:currentOwner, 11:isSpoiled
                    is_spoiled = product[11]  # isSpoiled at index 11
                    if is_spoiled and (worker_temp_violations > 0 or worker_humidity_violations > 0):
                        spoiled_shipments += 1
                        print(f"    ⚠️ Product spoiled due to violations")
                        
            except Exception as e:
                print(f"❌ Error processing product {i}: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"📊 Final stats: {total_shipments} shipments, {total_temp_checks} checks")
        
        # Apply recent filter if requested
        if recent_only and limit and temperature_records:
            temperature_records = sorted(
                temperature_records, 
                key=lambda x: x['timestamp'], 
                reverse=True
            )[:limit]
            
            # Recalculate based on recent records
            total_temp_checks = len(temperature_records)
            out_of_range_readings = sum(1 for r in temperature_records 
                                       if not r['temp_in_range'] or not r['humidity_in_range'])
        
        # Calculate metrics
        success_rate = 0.0
        if total_shipments > 0:
            success_rate = ((total_shipments - spoiled_shipments) / total_shipments) * 100
        
        temp_compliance_rate = 0.0
        if total_temp_checks > 0:
            temp_compliance_rate = ((total_temp_checks - out_of_range_readings) / total_temp_checks) * 100
        
        # Combined performance score (70% success rate, 30% temp compliance)
        performance_score = (0.7 * success_rate + 0.3 * temp_compliance_rate)
        
        return {
            "worker_id": worker_id,
            "total_shipments_handled": total_shipments,
            "spoiled_shipments": spoiled_shipments,
            "successful_shipments": total_shipments - spoiled_shipments,
            "success_rate": round(success_rate, 2),
            "total_temp_checks": total_temp_checks,
            "out_of_range_readings": out_of_range_readings,
            "temp_compliance_rate": round(temp_compliance_rate, 2),
            "performance_score": round(performance_score, 2),
            "products_handled": list(handled_products),
            "recent_temperatures": temperature_records[-10:] if temperature_records else []
        }
        
    except Exception as e:
        print(f"❌ FATAL ERROR in calculate_worker_performance: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error calculating performance: {str(e)}")
@router.get("/worker/{worker_id}")
def get_worker_performance(worker_id: int, recent_only: bool = False, limit: int = 50):
    """
    Get detailed performance metrics for a specific worker
    """
    try:
        # Verify worker exists
        worker = contract.functions.workers(worker_id).call()
        if not worker[1]:  # name field is empty
            raise HTTPException(status_code=404, detail="Worker not found")
        
        performance = calculate_worker_performance(worker_id, recent_only, limit)
        
        # Add worker info
        performance["worker_name"] = worker[1]
        performance["worker_role"] = ["MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"][worker[2]]
        
        return performance
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rankings")
def get_performance_rankings(role: str = None, min_shipments: int = 0, min_score: float = 0.0):
    """
    Get ranked list of all workers with their performance scores
    Optionally filter by role, minimum shipments, and minimum score
    """
    try:
        # Check if blockchain is connected
        from contract import web3
        if not web3.is_connected():
            raise HTTPException(
                status_code=503, 
                detail="Blockchain not connected. Make sure Hardhat node is running on http://127.0.0.1:8545"
            )
        
        workers = contract.functions.getWorkers().call()
        rankings = []
        
        for worker_data in workers:
            worker_id = worker_data[0]
            worker_name = worker_data[1]
            worker_role_enum = worker_data[2]
            worker_role = ["MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"][worker_role_enum]
            
            # Filter by role if specified
            if role and worker_role != role.upper():
                continue
            
            performance = calculate_worker_performance(worker_id)
            
            # Filter by minimum shipments
            if performance["total_shipments_handled"] < min_shipments:
                continue
            
            # Filter by minimum score
            if performance["performance_score"] < min_score:
                continue
            
            rankings.append({
                "worker_id": worker_id,
                "name": worker_name,
                "role": worker_role,
                "performance_score": performance["performance_score"],
                "success_rate": performance["success_rate"],
                "temp_compliance_rate": performance["temp_compliance_rate"],
                "total_shipments": performance["total_shipments_handled"],
                "spoiled_shipments": performance["spoiled_shipments"]
            })
        
        # Sort by performance score (descending)
        rankings.sort(key=lambda x: x["performance_score"], reverse=True)
        
        return {
            "total_workers": len(rankings),
            "filters": {
                "role": role,
                "min_shipments": min_shipments,
                "min_score": min_score
            },
            "rankings": rankings
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"Error: {str(e)}\n\nMake sure:\n1. Hardhat node is running (npx hardhat node)\n2. Contract is deployed (npx hardhat run scripts/deploy.js --network localhost)\n3. CONTRACT_ADDRESS in .env matches deployed address\n\nFull trace: {traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)


@router.get("/recommendations/distributor/{product_id}")
def get_distributor_recommendations(product_id: int, min_score: float = 70.0, top_n: int = 5):
    """
    Get recommended distributors for a product based on performance
    """
    try:
        # Get product details to understand temperature requirements
        product = contract.functions.products(product_id).call()
        if not product[1]:  # name field is empty
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get all distributors with their performance
        rankings = get_performance_rankings(role="DISTRIBUTOR", min_score=min_score)
        
        # Return top N recommendations
        recommendations = rankings["rankings"][:top_n]
        
        return {
            "product_id": product_id,
            "product_name": product[1],
            "min_temp": product[3],
            "max_temp": product[4],
            "recommended_distributors": recommendations,
            "total_eligible": len(rankings["rankings"])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"Error getting transporter recommendations: {str(e)}\n\nMake sure:\n1. Hardhat node is running (npx hardhat node)\n2. Contract is deployed (npx hardhat run scripts/deploy.js --network localhost)\n3. CONTRACT_ADDRESS in .env matches deployed address\n\nFull trace: {traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)


@router.get("/recommendations/transporter/{product_id}")
def get_transporter_recommendations(product_id: int, min_score: float = 70.0, top_n: int = 5):
    """
    Get recommended transporters for a product based on performance
    """
    try:
        # Get product details
        product = contract.functions.products(product_id).call()
        if not product[1]:  # name field is empty
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get all transporters with their performance
        rankings = get_performance_rankings(role="TRANSPORTER", min_score=min_score)
        
        # Return top N recommendations
        recommendations = rankings["rankings"][:top_n]
        
        return {
            "product_id": product_id,
            "product_name": product[1],
            "min_temp": product[3],
            "max_temp": product[4],
            "recommended_transporters": recommendations,
            "total_eligible": len(rankings["rankings"])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"Error getting transporter recommendations: {str(e)}\n\nMake sure:\n1. Hardhat node is running (npx hardhat node)\n2. Contract is deployed (npx hardhat run scripts/deploy.js --network localhost)\n3. CONTRACT_ADDRESS in .env matches deployed address\n\nFull trace: {traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)


@router.get("/comparison")
def compare_workers(worker_ids: str):
    """
    Compare performance of multiple workers
    worker_ids should be comma-separated like: 1,2,3
    """
    try:
        ids = [int(id.strip()) for id in worker_ids.split(",")]
        comparisons = []
        
        for worker_id in ids:
            try:
                performance = calculate_worker_performance(worker_id)
                worker = contract.functions.workers(worker_id).call()
                
                comparisons.append({
                    "worker_id": worker_id,
                    "name": worker[1],
                    "role": ["MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"][worker[2]],
                    "performance": performance
                })
            except Exception as e:
                print(f"Error getting performance for worker {worker_id}: {e}")
                continue
        
        return {
            "comparison": comparisons,
            "best_performer": max(comparisons, key=lambda x: x["performance"]["performance_score"]) if comparisons else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
