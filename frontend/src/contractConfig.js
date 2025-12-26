const contractABI = [
    {
        "inputs":  [

                   ],
        "stateMutability":  "nonpayable",
        "type":  "constructor"
    },
    {
        "anonymous":  false,
        "inputs":  [
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "fromWorker",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "toWorker",
                           "type":  "uint256"
                       }
                   ],
        "name":  "OwnershipTransferred",
        "type":  "event"
    },
    {
        "anonymous":  false,
        "inputs":  [
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "string",
                           "name":  "name",
                           "type":  "string"
                       }
                   ],
        "name":  "ProductAdded",
        "type":  "event"
    },
    {
        "anonymous":  false,
        "inputs":  [
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "int256",
                           "name":  "temperature",
                           "type":  "int256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "string",
                           "name":  "location",
                           "type":  "string"
                       }
                   ],
        "name":  "ProductSpoiled",
        "type":  "event"
    },
    {
        "anonymous":  false,
        "inputs":  [
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "temperature",
                           "type":  "uint256"
                       }
                   ],
        "name":  "SensorLogged",
        "type":  "event"
    },
    {
        "anonymous":  false,
        "inputs":  [
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "string",
                           "name":  "location",
                           "type":  "string"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "int256",
                           "name":  "temperature",
                           "type":  "int256"
                       }
                   ],
        "name":  "StatusUpdated",
        "type":  "event"
    },
    {
        "anonymous":  false,
        "inputs":  [
                       {
                           "indexed":  false,
                           "internalType":  "uint256",
                           "name":  "workerId",
                           "type":  "uint256"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "string",
                           "name":  "name",
                           "type":  "string"
                       },
                       {
                           "indexed":  false,
                           "internalType":  "enum SupplyChain.WorkerType",
                           "name":  "role",
                           "type":  "uint8"
                       }
                   ],
        "name":  "WorkerRegistered",
        "type":  "event"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "string",
                           "name":  "name",
                           "type":  "string"
                       },
                       {
                           "internalType":  "string",
                           "name":  "description",
                           "type":  "string"
                       },
                       {
                           "internalType":  "int256",
                           "name":  "minTemp",
                           "type":  "int256"
                       },
                       {
                           "internalType":  "int256",
                           "name":  "maxTemp",
                           "type":  "int256"
                       },
                       {
                           "internalType":  "int256",
                           "name":  "minHumidity",
                           "type":  "int256"
                       },
                       {
                           "internalType":  "int256",
                           "name":  "maxHumidity",
                           "type":  "int256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "quantity",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "string",
                           "name":  "mfgDate",
                           "type":  "string"
                       }
                   ],
        "name":  "addProduct",
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "address",
                           "name":  "",
                           "type":  "address"
                       }
                   ],
        "name":  "addressToWorkerId",
        "outputs":  [
                        {
                            "internalType":  "uint256",
                            "name":  "",
                            "type":  "uint256"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "workerId",
                           "type":  "uint256"
                       }
                   ],
        "name":  "getAssignedProducts",
        "outputs":  [
                        {
                            "internalType":  "uint256[]",
                            "name":  "",
                            "type":  "uint256[]"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       }
                   ],
        "name":  "getProduct",
        "outputs":  [
                        {
                            "components":  [
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "productId",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "string",
                                                   "name":  "name",
                                                   "type":  "string"
                                               },
                                               {
                                                   "internalType":  "string",
                                                   "name":  "description",
                                                   "type":  "string"
                                               },
                                               {
                                                   "internalType":  "int256",
                                                   "name":  "minTemp",
                                                   "type":  "int256"
                                               },
                                               {
                                                   "internalType":  "int256",
                                                   "name":  "maxTemp",
                                                   "type":  "int256"
                                               },
                                               {
                                                   "internalType":  "int256",
                                                   "name":  "minHumidity",
                                                   "type":  "int256"
                                               },
                                               {
                                                   "internalType":  "int256",
                                                   "name":  "maxHumidity",
                                                   "type":  "int256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "quantity",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "string",
                                                   "name":  "mfgDate",
                                                   "type":  "string"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "timestampCreated",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "currentOwner",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "bool",
                                                   "name":  "isSpoiled",
                                                   "type":  "bool"
                                               }
                                           ],
                            "internalType":  "struct SupplyChain.Product",
                            "name":  "",
                            "type":  "tuple"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       }
                   ],
        "name":  "getProductHistory",
        "outputs":  [
                        {
                            "components":  [
                                               {
                                                   "internalType":  "string",
                                                   "name":  "location",
                                                   "type":  "string"
                                               },
                                               {
                                                   "internalType":  "int256",
                                                   "name":  "temperature",
                                                   "type":  "int256"
                                               },
                                               {
                                                   "internalType":  "int256",
                                                   "name":  "humidity",
                                                   "type":  "int256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "workerId",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "productId",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "quantity",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "bool",
                                                   "name":  "isSpoiled",
                                                   "type":  "bool"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "timestamp",
                                                   "type":  "uint256"
                                               }
                                           ],
                            "internalType":  "struct SupplyChain.Status[]",
                            "name":  "",
                            "type":  "tuple[]"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       }
                   ],
        "name":  "getSensorData",
        "outputs":  [
                        {
                            "components":  [
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "temp",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "humidity",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "heatIndex",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "timestamp",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "productId",
                                                   "type":  "uint256"
                                               }
                                           ],
                            "internalType":  "struct SupplyChain.SensorData[]",
                            "name":  "",
                            "type":  "tuple[]"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [

                   ],
        "name":  "getWorkers",
        "outputs":  [
                        {
                            "components":  [
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "workerId",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "string",
                                                   "name":  "name",
                                                   "type":  "string"
                                               },
                                               {
                                                   "internalType":  "enum SupplyChain.WorkerType",
                                                   "name":  "role",
                                                   "type":  "uint8"
                                               },
                                               {
                                                   "internalType":  "uint256",
                                                   "name":  "timestamp",
                                                   "type":  "uint256"
                                               },
                                               {
                                                   "internalType":  "address",
                                                   "name":  "account",
                                                   "type":  "address"
                                               }
                                           ],
                            "internalType":  "struct SupplyChain.Worker[]",
                            "name":  "",
                            "type":  "tuple[]"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "address",
                           "name":  "",
                           "type":  "address"
                       }
                   ],
        "name":  "isRegisteredWorker",
        "outputs":  [
                        {
                            "internalType":  "bool",
                            "name":  "",
                            "type":  "bool"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "temp",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "humidity",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "heatIndex",
                           "type":  "uint256"
                       }
                   ],
        "name":  "logSensorData",
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable",
        "type":  "function"
    },
    {
        "inputs":  [

                   ],
        "name":  "owner",
        "outputs":  [
                        {
                            "internalType":  "address",
                            "name":  "",
                            "type":  "address"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "",
                           "type":  "uint256"
                       }
                   ],
        "name":  "productHistory",
        "outputs":  [
                        {
                            "internalType":  "string",
                            "name":  "location",
                            "type":  "string"
                        },
                        {
                            "internalType":  "int256",
                            "name":  "temperature",
                            "type":  "int256"
                        },
                        {
                            "internalType":  "int256",
                            "name":  "humidity",
                            "type":  "int256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "workerId",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "productId",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "quantity",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "bool",
                            "name":  "isSpoiled",
                            "type":  "bool"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "timestamp",
                            "type":  "uint256"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "",
                           "type":  "uint256"
                       }
                   ],
        "name":  "products",
        "outputs":  [
                        {
                            "internalType":  "uint256",
                            "name":  "productId",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "string",
                            "name":  "name",
                            "type":  "string"
                        },
                        {
                            "internalType":  "string",
                            "name":  "description",
                            "type":  "string"
                        },
                        {
                            "internalType":  "int256",
                            "name":  "minTemp",
                            "type":  "int256"
                        },
                        {
                            "internalType":  "int256",
                            "name":  "maxTemp",
                            "type":  "int256"
                        },
                        {
                            "internalType":  "int256",
                            "name":  "minHumidity",
                            "type":  "int256"
                        },
                        {
                            "internalType":  "int256",
                            "name":  "maxHumidity",
                            "type":  "int256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "quantity",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "string",
                            "name":  "mfgDate",
                            "type":  "string"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "timestampCreated",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "currentOwner",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "bool",
                            "name":  "isSpoiled",
                            "type":  "bool"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "string",
                           "name":  "name",
                           "type":  "string"
                       },
                       {
                           "internalType":  "enum SupplyChain.WorkerType",
                           "name":  "role",
                           "type":  "uint8"
                       },
                       {
                           "internalType":  "address",
                           "name":  "workerAddress",
                           "type":  "address"
                       }
                   ],
        "name":  "registerWorker",
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "",
                           "type":  "uint256"
                       }
                   ],
        "name":  "sensorLogs",
        "outputs":  [
                        {
                            "internalType":  "uint256",
                            "name":  "temp",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "humidity",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "heatIndex",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "timestamp",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "productId",
                            "type":  "uint256"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "newWorkerId",
                           "type":  "uint256"
                       }
                   ],
        "name":  "transferOwnership",
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "productId",
                           "type":  "uint256"
                       },
                       {
                           "internalType":  "string",
                           "name":  "location",
                           "type":  "string"
                       },
                       {
                           "internalType":  "int256",
                           "name":  "temperature",
                           "type":  "int256"
                       },
                       {
                           "internalType":  "int256",
                           "name":  "humidity",
                           "type":  "int256"
                       },
                       {
                           "internalType":  "uint256",
                           "name":  "quantity",
                           "type":  "uint256"
                       }
                   ],
        "name":  "updateStatus",
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable",
        "type":  "function"
    },
    {
        "inputs":  [
                       {
                           "internalType":  "uint256",
                           "name":  "",
                           "type":  "uint256"
                       }
                   ],
        "name":  "workers",
        "outputs":  [
                        {
                            "internalType":  "uint256",
                            "name":  "workerId",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "string",
                            "name":  "name",
                            "type":  "string"
                        },
                        {
                            "internalType":  "enum SupplyChain.WorkerType",
                            "name":  "role",
                            "type":  "uint8"
                        },
                        {
                            "internalType":  "uint256",
                            "name":  "timestamp",
                            "type":  "uint256"
                        },
                        {
                            "internalType":  "address",
                            "name":  "account",
                            "type":  "address"
                        }
                    ],
        "stateMutability":  "view",
        "type":  "function"
    }
]

export default contractABI;
