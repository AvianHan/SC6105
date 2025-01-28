import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import { ArrowLeft } from 'lucide-react';
import Select from 'react-select';

export default function PdfUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [result, setResult] = useState({ cid: '', txHash: '' });
  const [error, setError] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);

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
    setSelectedFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('请先选择一个文件');
      return;
    }

    if (!title.trim()) {
      setError('请输入论文标题');
      return;
    }

    if (!abstract.trim()) {
      setError('请输入论文摘要');
      return;
    }

    if (selectedKeywords.length === 0) {
      setError('请至少选择一个关键词');
      return;
    }

    const formData = new FormData();
    formData.append('paper', selectedFile);
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('keywords', JSON.stringify(selectedKeywords.map(k => k.value)));

    try {
      const response = await fetch('http://localhost:3000/paper/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        setResult({ cid: data.cid, txHash: data.txHash || '' });
        setError('');
        // 清空表单
        setTitle('');
        setAbstract('');
        setSelectedKeywords([]);
        setSelectedFile(null);
      } else {
        setError(data.message || '上传失败');
      }
    } catch (error) {
      console.error(error);
      setError('文件上传出错，请重试');
    }
  };

  return (
    <div>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>

      <h1 className={styles.title}>论文上传</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">论文标题</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.textInput}
            placeholder="请输入论文标题"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="abstract">论文摘要</label>
          <textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className={styles.textArea}
            placeholder="请输入论文摘要"
            rows={5}
          />
        </div>

        <div className={styles.fileInput}>
          <label>上传PDF文件</label>
          <input 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>关键词</label>
          <Select
            isMulti
            name="keywords"
            options={keywordOptions}
            value={selectedKeywords}
            onChange={handleKeywordsChange}
            placeholder="选择关键词（可多选）"
            className={styles.selectContainer}
            classNamePrefix="select"
          />
        </div>

        <button 
          onClick={handleUpload} 
          className={styles.button}
        >
          上传论文
        </button>

        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        {result.cid && (
          <div className={styles.resultContainer}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>CID:</span>
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