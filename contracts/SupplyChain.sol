// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
  ============================================================
      PHARMACEUTICAL SUPPLY CHAIN TRACKING SMART CONTRACT
      Features:
        - Product Registration
        - Worker Registration (Manufacturer / Distributor / Transporter)
        - Product Movement Status Updates
        - Ownership Transfer
        - Sensor Data Logging (Manual for prototype)
        - Tamper-proof tracking using Blockchain
        - Event-based Observer Pattern (Frontend listening)
  ============================================================
*/

contract SupplyChain {

    // ---------------------- OWNER --------------------------
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "YOU ARE NOT THE OWNER");
        _;
    }

    // ---------------------- IDs ----------------------------
    uint256 private productIdCounter = 0;
    uint256 private workerIdCounter = 0;

    // ---------------------- ENUMS ---------------------------
    enum WorkerType { MANUFACTURER, DISTRIBUTOR, TRANSPORTER }

    // ---------------------- STRUCTS -------------------------

    struct Worker {
        uint256 workerId;
        string name;
        WorkerType role;
        uint256 timestamp;
        address account;
    }

    struct Product {
        uint256 productId;
        string name;
        string description;
        int256 minTemp;
        int256 maxTemp;
        int256 minHumidity;
        int256 maxHumidity;
        uint256 quantity;
        string mfgDate;
        uint256 timestampCreated;
        uint256 currentOwner;
        bool isSpoiled;
    }

    struct Status {
        string location;
        int256 temperature;
        int256 humidity;
        uint256 workerId;
        uint256 productId;
        uint256 quantity;
        bool isSpoiled;
        uint256 timestamp;
    }

    struct SensorData {
        uint256 temp;
        uint256 humidity;
        uint256 heatIndex;
        uint256 timestamp;
        uint256 productId;
    }

    // ---------------------- MAPPINGS ------------------------

    mapping(uint256 => Worker) public workers;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Status[]) public productHistory;
    mapping(uint256 => SensorData[]) public sensorLogs;
    mapping(address => uint256) public addressToWorkerId;  // New: Map address to worker ID
    mapping(address => bool) public isRegisteredWorker;    // New: Check if address is registered

    // ---------------------- MODIFIERS ------------------------

    modifier onlyManufacturer() {
        require(isRegisteredWorker[msg.sender], "NOT A REGISTERED WORKER");
        uint256 workerId = addressToWorkerId[msg.sender];
        require(workers[workerId].role == WorkerType.MANUFACTURER, "ONLY MANUFACTURER CAN ADD PRODUCTS");
        _;
    }

    modifier onlyDistributorOrTransporter() {
        require(isRegisteredWorker[msg.sender], "NOT A REGISTERED WORKER");
        uint256 workerId = addressToWorkerId[msg.sender];
        require(
            workers[workerId].role == WorkerType.DISTRIBUTOR || 
            workers[workerId].role == WorkerType.TRANSPORTER,
            "ONLY DISTRIBUTOR OR TRANSPORTER CAN UPDATE STATUS"
        );
        _;
    }

    // ---------------------- EVENTS (Observer Pattern) ------------------------

    event WorkerRegistered(uint256 workerId, string name, WorkerType role);
    event ProductAdded(uint256 productId, string name);
    event StatusUpdated(uint256 productId, string location, int256 temperature);
    event OwnershipTransferred(uint256 productId, uint256 fromWorker, uint256 toWorker);
    event SensorLogged(uint256 productId, uint256 temperature);
    event ProductSpoiled(uint256 productId, int256 temperature, string location);

    // ---------------------- FUNCTIONS ------------------------

    // 1️⃣ REGISTER WORKER (Manufacturer / Distributor / Transporter)
    function registerWorker(string memory name, WorkerType role, address workerAddress) 
        public 
        onlyOwner 
    {
        require(!isRegisteredWorker[workerAddress], "ADDRESS ALREADY REGISTERED");
        
        workers[workerIdCounter] = Worker(
            workerIdCounter,
            name,
            role,
            block.timestamp,
            workerAddress
        );

        addressToWorkerId[workerAddress] = workerIdCounter;
        isRegisteredWorker[workerAddress] = true;

        emit WorkerRegistered(workerIdCounter, name, role);
        workerIdCounter++;
    }

    // 2️⃣ ADD PRODUCT (Only Manufacturer)
    function addProduct(
        string memory name,
        string memory description,
        int256 minTemp,
        int256 maxTemp,
        int256 minHumidity,
        int256 maxHumidity,
        uint256 quantity,
        string memory mfgDate
    ) 
        public 
        onlyManufacturer 
    {
        require(minTemp <= maxTemp, "MIN TEMP CANNOT BE GREATER THAN MAX TEMP");
        require(minHumidity <= maxHumidity, "MIN HUMIDITY CANNOT BE GREATER THAN MAX HUMIDITY");
        require(quantity > 0, "QUANTITY MUST BE GREATER THAN ZERO");
        
        uint256 manufacturerId = addressToWorkerId[msg.sender];
        
        products[productIdCounter] = Product(
            productIdCounter,
            name,
            description,
            minTemp,
            maxTemp,
            minHumidity,
            maxHumidity,
            quantity,
            mfgDate,
            block.timestamp,
            manufacturerId,     // initial owner
            false               // not spoiled initially
        );

        emit ProductAdded(productIdCounter, name);
        productIdCounter++;
    }

    // 3️⃣ UPDATE STATUS (Only Distributor or Transporter)
    function updateStatus(
        uint256 productId,
        string memory location,
        int256 temperature,
        int256 humidity,
        uint256 quantity
    ) 
        public 
        onlyDistributorOrTransporter
    {
        require(productId < productIdCounter, "PRODUCT DOES NOT EXIST");
        
        Product storage product = products[productId];
        
        // 🔒 PREVENT UPDATES TO SPOILED PRODUCTS
        require(!product.isSpoiled, "PRODUCT IS SPOILED - CANNOT UPDATE");
        
        uint256 workerId = addressToWorkerId[msg.sender];
        
        // 🎯 ONLY ASSIGNED WORKER CAN UPDATE
        require(product.currentOwner == workerId, "ONLY ASSIGNED WORKER CAN UPDATE THIS PRODUCT");
        
        // Check if temperature AND humidity are within acceptable range
        bool tempViolation = (temperature < product.minTemp || temperature > product.maxTemp);
        bool humidityViolation = (humidity < product.minHumidity || humidity > product.maxHumidity);
        bool isSpoiled = tempViolation || humidityViolation;
        
        // If spoiled, update product's spoiled flag
        if (isSpoiled && !product.isSpoiled) {
            product.isSpoiled = true;
        }

        Status memory s = Status(
            location,
            temperature,
            humidity,
            workerId,
            productId,
            quantity,
            isSpoiled,
            block.timestamp
        );

        productHistory[productId].push(s);

        emit StatusUpdated(productId, location, temperature);
    }

    // 4️⃣ TRANSFER OWNERSHIP (Assign worker to product)
    function transferOwnership(uint256 productId, uint256 newWorkerId) public {
        require(productId < productIdCounter, "INVALID PRODUCT ID");
        require(newWorkerId < workerIdCounter, "INVALID WORKER ID");
        
        // Only the current owner of the product or contract owner can transfer
        uint256 senderWorkerId = addressToWorkerId[msg.sender];
        require(
            msg.sender == owner || products[productId].currentOwner == senderWorkerId,
            "ONLY CURRENT OWNER CAN ASSIGN"
        );

        uint256 oldOwner = products[productId].currentOwner;
        products[productId].currentOwner = newWorkerId;

        emit OwnershipTransferred(productId, oldOwner, newWorkerId);
    }

    // 5️⃣ ADD SENSOR DATA (manual entry without IoT)
    function logSensorData(
        uint256 productId,
        uint256 temp,
        uint256 humidity,
        uint256 heatIndex
    ) 
        public 
    {
        require(productId < productIdCounter, "INVALID PRODUCT ID");

        SensorData memory d = SensorData(
            temp,
            humidity,
            heatIndex,
            block.timestamp,
            productId
        );

        sensorLogs[productId].push(d);

        emit SensorLogged(productId, temp);
    }

    // ---------------------- VIEW FUNCTIONS ------------------------

    function getProduct(uint256 productId) public view returns(Product memory) 
    {
        return products[productId];
    }

    function getWorkers() 
        public 
        view 
        returns(Worker[] memory) 
    {
        Worker[] memory allWorkers = new Worker[](workerIdCounter);
        for(uint i = 0; i < workerIdCounter; i++){
            allWorkers[i] = workers[i];
        }
        return allWorkers;
    }

    function getProductHistory(uint256 productId) 
        public 
        view 
        returns(Status[] memory) 
    {
        return productHistory[productId];
    }

    function getSensorData(uint256 productId) 
        public 
        view 
        returns(SensorData[] memory) 
    {
        return sensorLogs[productId];
    }

    // Get all products assigned to a specific worker
    function getAssignedProducts(uint256 workerId) 
        public 
        view 
        returns(uint256[] memory) 
    {
        // First, count how many products are assigned to this worker
        uint256 count = 0;
        for(uint i = 0; i < productIdCounter; i++) {
            if(products[i].currentOwner == workerId) {
                count++;
            }
        }
        
        // Create array of assigned product IDs
        uint256[] memory assignedProducts = new uint256[](count);
        uint256 index = 0;
        for(uint i = 0; i < productIdCounter; i++) {
            if(products[i].currentOwner == workerId) {
                assignedProducts[index] = i;
                index++;
            }
        }
        
        return assignedProducts;
    }
}
