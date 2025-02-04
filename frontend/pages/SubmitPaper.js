// frontend/pages/SubmitPaper.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import { ArrowLeft, Upload, File, X } from 'lucide-react';
import Select from 'react-select';

export default function PdfUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [result, setResult] = useState({ cid: '', txHash: '' });
  const [error, setError] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const keywordOptions = [
    { value: '3D Reconstruction', label: '3D Reconstruction' },
    { value: 'AI History', label: 'AI History' },
    { value: 'AI Optimization', label: 'AI Optimization' },
    { value: 'AI Planning', label: 'AI Planning' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Analysis', label: 'Analysis' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'Computer Vision', label: 'Computer Vision' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Deep Learning', label: 'Deep Learning' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Natural Language Processing', label: 'Natural Language Processing' },
    { value: 'Neural Networks', label: 'Neural Networks' },
    { value: 'NLP', label: 'NLP' },
    { value: 'Optimization', label: 'Optimization' },
    { value: 'Robotics', label: 'Robotics' },
    { value: 'Transformers', label: 'Transformers' }
  ];

  const handleKeywordsChange = (selectedOptions) => {
    setSelectedKeywords(selectedOptions || []);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please drop a PDF file');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
  };

  /**
   * Key part: also include "author_id" in FormData
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter the paper title');
      return;
    }

    if (!abstract.trim()) {
      setError('Please enter the paper abstract');
      return;
    }

    if (selectedKeywords.length === 0) {
      setError('Please select at least one keyword');
      return;
    }

    // get current user's author_id
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      setError('You are not logged in');
      return;
    }
    const user = JSON.parse(storedUserInfo);
    const authorId = user.accountId;

    const formData = new FormData();
    formData.append('paper', selectedFile);
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('keywords', JSON.stringify(selectedKeywords.map(k => k.value)));

    // crucial: pass author_id to backend
    formData.append('author_id', authorId);

    try {
      const response = await fetch('http://localhost:3000/paper/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setResult({ cid: data.cid, txHash: data.txHash || '' });
        setError('');
        setTitle('');
        setAbstract('');
        setSelectedKeywords([]);
        setSelectedFile(null);
      } else {
        setError(data.message || 'Failed to upload file, please try again');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload file, please try again');
    }
  };

  return (
    <div>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>

      <h1 className={styles.title}>Upload Your Paper</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Paper Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.textInput}
            placeholder="Enter the title"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="abstract">Paper Abstract</label>
          <textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className={styles.textArea}
            placeholder="Enter the abstract"
            rows={5}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Upload PDF</label>
          <div
            className={`${styles.fileDropzone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className={styles.uploadPrompt}>
                <Upload className={styles.uploadIcon} />
                <p>
                  Drag and drop your PDF here, or
                  <label className={styles.browseLabel}>
                    <span className={styles.browseText}> browse</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className={styles.hiddenInput}
                    />
                  </label>
                </p>
                <p className={styles.fileHint}>PDF files only, up to 10MB</p>
              </div>
            ) : (
              <div className={styles.selectedFile}>
                <div className={styles.fileInfo}>
                  <File className={styles.fileIcon} />
                  <div>
                    <p className={styles.fileName}>{selectedFile.name}</p>
                    <p className={styles.fileSize}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className={styles.removeButton}
                >
                  <X />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Keywords</label>
          <Select
            isMulti
            name="keywords"
            options={keywordOptions}
            value={selectedKeywords}
            onChange={handleKeywordsChange}
            placeholder="Select keywords"
            className={styles.selectContainer}
            classNamePrefix="select"
          />
        </div>

        <button 
          onClick={handleUpload} 
          className={styles.button}
        >
          Upload Your Paper
        </button>

        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        {result.cid && (
          <div className={styles.resultContainer}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>DID:</span>
              {result.cid}
            </div>
            {result.txHash && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Transaction Hash:</span>
                {result.txHash}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
