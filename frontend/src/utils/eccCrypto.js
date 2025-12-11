/**
 * Elliptic Curve Cryptography Utilities
 * Uses secp256k1 curve (same as Ethereum/Bitcoin)
 * For Product QR Code Authentication
 */

import elliptic from 'elliptic';
import { ethers } from 'ethers';

const EC = elliptic.ec;
const ec = new EC('secp256k1');

/**
 * Generate a new ECC key pair
 * @returns {Object} { publicKey: string, privateKey: string }
 */
export const generateKeyPair = () => {
  const keyPair = ec.genKeyPair();
  return {
    privateKey: keyPair.getPrivate('hex'),
    publicKey: keyPair.getPublic('hex')
  };
};

/**
 * Derive public key from Ethereum private key
 * @param {string} ethereumPrivateKey - Ethereum private key (with or without 0x prefix)
 * @returns {string} Public key in hex format
 */
export const getPublicKeyFromPrivate = (ethereumPrivateKey) => {
  // Remove 0x prefix if present
  const cleanKey = ethereumPrivateKey.startsWith('0x') 
    ? ethereumPrivateKey.slice(2) 
    : ethereumPrivateKey;
  
  const keyPair = ec.keyFromPrivate(cleanKey, 'hex');
  return keyPair.getPublic('hex');
};

/**
 * Sign product data with manufacturer's private key
 * @param {Object} productData - Product information to sign
 * @param {string} privateKey - Manufacturer's private key (from MetaMask)
 * @returns {Object} { signature: string, hash: string, publicKey: string }
 */
export const signProductData = async (productData, privateKey) => {
  try {
    // Create deterministic hash of product data
    const dataString = JSON.stringify({
      productId: productData.productId,
      name: productData.name,
      description: productData.description,
      minTemp: productData.minTemp,
      maxTemp: productData.maxTemp,
      quantity: productData.quantity,
      mfgDate: productData.mfgDate,
      timestamp: productData.timestamp
    });

    // Hash the data using ethers
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
    const hashArray = ethers.getBytes(hash);

    // Remove 0x prefix from private key if present
    const cleanPrivateKey = privateKey.startsWith('0x') 
      ? privateKey.slice(2) 
      : privateKey;

    // Sign with ECC
    const keyPair = ec.keyFromPrivate(cleanPrivateKey, 'hex');
    const signature = keyPair.sign(hashArray);
    
    // Get DER format signature
    const derSignature = signature.toDER('hex');
    const publicKey = keyPair.getPublic('hex');

    return {
      signature: derSignature,
      hash: hash,
      publicKey: publicKey,
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex'),
      recoveryParam: signature.recoveryParam
    };
  } catch (error) {
    console.error('Error signing product data:', error);
    throw new Error('Failed to sign product data: ' + error.message);
  }
};

/**
 * Verify product signature
 * @param {Object} productData - Product information
 * @param {string} signature - Signature in DER format
 * @param {string} publicKey - Manufacturer's public key
 * @returns {boolean} True if signature is valid
 */
export const verifyProductSignature = (productData, signature, publicKey) => {
  try {
    // Recreate the same hash
    const dataString = JSON.stringify({
      productId: productData.productId,
      name: productData.name,
      description: productData.description,
      minTemp: productData.minTemp,
      maxTemp: productData.maxTemp,
      quantity: productData.quantity,
      mfgDate: productData.mfgDate,
      timestamp: productData.timestamp
    });

    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
    const hashArray = ethers.getBytes(hash);

    // Get public key point
    const key = ec.keyFromPublic(publicKey, 'hex');
    
    // Verify signature
    const isValid = key.verify(hashArray, signature);
    
    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

/**
 * Sign product using MetaMask wallet
 * @param {Object} productData - Product information
 * @param {Object} signer - Ethers signer from MetaMask
 * @returns {Object} Signed data with signature
 */
export const signProductWithMetaMask = async (productData, signer) => {
  try {
    // Create message to sign
    const dataString = JSON.stringify({
      productId: productData.productId,
      name: productData.name,
      description: productData.description,
      minTemp: productData.minTemp,
      maxTemp: productData.maxTemp,
      quantity: productData.quantity,
      mfgDate: productData.mfgDate,
      timestamp: productData.timestamp
    });

    // Sign with MetaMask (EIP-191)
    const signature = await signer.signMessage(dataString);
    
    // Get address for verification
    const address = await signer.getAddress();
    
    return {
      signature: signature,
      message: dataString,
      signerAddress: address,
      timestamp: productData.timestamp
    };
  } catch (error) {
    console.error('Error signing with MetaMask:', error);
    throw new Error('Failed to sign with MetaMask: ' + error.message);
  }
};

/**
 * Verify MetaMask signature
 * @param {string} message - Original message
 * @param {string} signature - Signature from MetaMask
 * @param {string} expectedAddress - Expected signer address
 * @returns {boolean} True if signature is valid
 */
export const verifyMetaMaskSignature = (message, signature, expectedAddress) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying MetaMask signature:', error);
    return false;
  }
};

/**
 * Create secure QR code data with signature
 * @param {Object} productData - Product information
 * @param {string} signature - ECC signature
 * @param {string} publicKey - Manufacturer's public key
 * @returns {string} JSON string for QR code
 */
export const createSecureQRData = (productData, signature, publicKey) => {
  return JSON.stringify({
    product: {
      id: productData.productId,
      name: productData.name,
      mfgDate: productData.mfgDate,
      tempRange: `${productData.minTemp}°C to ${productData.maxTemp}°C`
    },
    security: {
      signature: signature,
      publicKey: publicKey,
      timestamp: productData.timestamp
    },
    verification: {
      blockchain: 'Ethereum',
      contract: productData.contractAddress || 'N/A'
    }
  });
};

/**
 * Parse and verify QR code data
 * @param {string} qrDataString - QR code data JSON string
 * @returns {Object} { valid: boolean, data: Object, message: string }
 */
export const parseAndVerifyQR = (qrDataString) => {
  try {
    const qrData = JSON.parse(qrDataString);
    
    if (!qrData.product || !qrData.security) {
      return {
        valid: false,
        data: null,
        message: 'Invalid QR code format'
      };
    }

    // Extract data for verification
    const productData = {
      productId: qrData.product.id,
      name: qrData.product.name,
      mfgDate: qrData.product.mfgDate,
      timestamp: qrData.security.timestamp
    };

    // Verify signature
    const isValid = verifyProductSignature(
      productData,
      qrData.security.signature,
      qrData.security.publicKey
    );

    return {
      valid: isValid,
      data: qrData,
      message: isValid 
        ? '✅ Authentic Product - Signature Verified' 
        : '❌ Invalid Signature - Possible Counterfeit'
    };
  } catch (error) {
    return {
      valid: false,
      data: null,
      message: 'Error parsing QR code: ' + error.message
    };
  }
};

/**
 * Get shortened fingerprint of public key for display
 * @param {string} publicKey - Full public key
 * @returns {string} Shortened fingerprint
 */
export const getPublicKeyFingerprint = (publicKey) => {
  if (!publicKey) return 'N/A';
  
  // Take hash of public key and show first 8 and last 8 chars
  const hash = ethers.keccak256(ethers.toUtf8Bytes(publicKey));
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export default {
  generateKeyPair,
  getPublicKeyFromPrivate,
  signProductData,
  verifyProductSignature,
  signProductWithMetaMask,
  verifyMetaMaskSignature,
  createSecureQRData,
  parseAndVerifyQR,
  getPublicKeyFingerprint
};
