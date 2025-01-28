import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Select from 'react-select';

export default function Register() {
  const [formData, setFormData] = useState({
    accountId: '',
    password: '',
    nickname: '',
    reviewer: false,
    author: false,
    fields: []
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const fieldOptions = [
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

  const handleFieldChange = (selectedOptions) => {
    setFormData(prevData => ({
      ...prevData,
      fields: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.reviewer && formData.fields.length === 0) {
      setError('评审者必须选择至少一个领域');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        field: formData.fields.join(',')
      };

      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        setError(errorData.message || '注册失败');
      }
    } catch (error) {
      setError('注册失败，请重试');
      console.error('注册失败:', error);
    }
  };

  return (
    <div>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>

      <h1 className={styles.title}>注册</h1>
      
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="账号"
            className={styles.input}
            onChange={(e) => setFormData({...formData, accountId: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="密码"
            className={styles.input}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="昵称"
            className={styles.input}
            onChange={(e) => setFormData({...formData, nickname: e.target.value})}
          />
        </div>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.reviewer}
              onChange={(e) => setFormData({...formData, reviewer: e.target.checked})}
            />
            评审者
          </label>
        </div>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.checked})}
            />
            作者
          </label>
        </div>

        {formData.reviewer && (
          <div className={styles.inputGroup}>
            <label>选择领域</label>
            <Select
              isMulti
              name="fields"
              options={fieldOptions}
              value={fieldOptions.filter(option => 
                formData.fields.includes(option.value)
              )}
              onChange={handleFieldChange}
              placeholder="选择领域（可多选）"
              className={styles.selectContainer}
              classNamePrefix="select"
            />
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.button}>
          注册
        </button>
      </form>
    </div>
  );
}