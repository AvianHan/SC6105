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
      setError('Reviewer must select at least one field');
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
        setError(errorData.message || 'Register failed, please try again');
      }
    } catch (error) {
      setError('Register failed, please try again');
      console.error('Register failed', error);
    }
  };

  return (
    <div>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>

      <h1 className={styles.title}>Register</h1>
      
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Account ID"
            className={styles.input}
            onChange={(e) => setFormData({...formData, accountId: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nickname"
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
            Reviewer
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
            Author
          </label>
        </div>

        {formData.reviewer && (
          <div className={styles.inputGroup}>
            <label>Select your field</label>
            <Select
              isMulti
              name="fields"
              options={fieldOptions}
              value={fieldOptions.filter(option => 
                formData.fields.includes(option.value)
              )}
              onChange={handleFieldChange}
              placeholder="Please select your field"
              className={styles.selectContainer}
              classNamePrefix="select"
            />
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}