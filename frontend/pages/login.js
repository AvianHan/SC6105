import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ accountId: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
  
      const data = await res.json();
      // 存储认证信息和用户信息
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        accountId: data.user.account_id,
        nickname: data.user.nickname,
        reviewer: data.user.reviewer,
        author: data.user.author,
        field: data.user.field
      }));
      router.push('/SubmitPaper');
    } catch (error) {
      setError('login failed: ' + error.message);
      console.error('login failed:', error.message);
    }
  };

  return (
    <div>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>
      
      <h1 className={styles.title}>Login</h1>
      
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="account"
          className={styles.input}
          value={credentials.accountId}
          onChange={(e) => setCredentials({...credentials, accountId: e.target.value})}
        />
        <input
          type="password"
          placeholder="password"
          className={styles.input}
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}