import axios from 'axios';

const uploadPDF = async (file) => {
  if (file.type !== 'application/pdf') {
    throw new Error('Please select a PDF file');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      gateway: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
