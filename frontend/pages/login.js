// frontend/pages/login.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [credentials, setCredentials] = useState({ accountId: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/SubmitPaper');
    } catch (error) {
      console.error('登录失败:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">登录</h2>
        <input
          type="text"
          placeholder="账号"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setCredentials({ ...credentials, accountId: e.target.value })}
        />
        <input
          type="password"
          placeholder="密码"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          登录
        </button>
      </form>
    </div>
  );
}
