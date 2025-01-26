// backend/pinata.js

require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const streamifier = require('streamifier');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  console.error("Pinata API Key and Secret must be provided in .env");
  process.exit(1);
}

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

async function testPinataConnection() {
  try {
    const result = await pinata.testAuthentication();
    console.log("Pinata connection successful:", result);
  } catch (error) {
    console.error("Pinata connection failed:", error);
    process.exit(1);
  }
}

/**
 * @param {Buffer} fileBuffer - memory space of file
 * @param {String} fileName - name of meta data, optional
 * @returns {Promise<String>} - return IPFS Hash (CID)
 */
async function uploadFileToPinata(fileBuffer, fileName = "uploadedFile") {

  const readableStream = streamifier.createReadStream(fileBuffer); // convert buffer to stream

  const options = {
    pinataMetadata: {
      name: fileName,
      // keyvalues: {
      //   project: "DApp Project",
      //   author: "John Doe",
      //   type: "document"
      // }
    },
    pinataOptions: {
      cidVersion: 1, // 0 or 1
      wrapWithDirectory: true
    }
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStream, options);
    // result = IpfsHash, PinSize, Timestamp
    console.log("Pinata pinFileToIPFS result:", result);
    return result.IpfsHash; // CID
  } catch (error) {
    console.error("uploadFileToPinata error:", error);
    throw error;
  }
}

module.exports = {
  testPinataConnection,
  uploadFileToPinata
};
