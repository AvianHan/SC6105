// frontend/pages/SubmitPaper.js

import { useState } from 'react';

export default function PdfUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState({ cid: '', txHash: '' });

  // 当用户选文件时，拿到文件对象
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 点击上传
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    // 用FormData发送文件到后端
    const formData = new FormData();
    formData.append('paper', selectedFile);

    try {
      // 这里写后端接口的地址
      const response = await fetch('http://localhost:3000/paper/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert(`Upload successful! CID: ${data.cid}`);
        setResult({ cid: data.cid, txHash: data.txHash || '' });
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload Paper to Pinata & Store CID on Blockchain</h1>

      <input type="file" onChange={handleFileChange} />
      <button style={{ marginLeft: 10 }} onClick={handleUpload}>Upload</button>

      {result.cid && (
        <div style={{ marginTop: 20 }}>
          <p><strong>CID:</strong> {result.cid}</p>
          {result.txHash && <p><strong>Transaction Hash:</strong> {result.txHash}</p>}
        </div>
      )}
    </div>
  );
}
