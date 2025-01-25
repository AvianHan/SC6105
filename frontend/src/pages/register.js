import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({
    accountId: '',
    password: '',
    nickname: '',
    reviewer: false,
    author: false,
  });
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">注册</h2>
        <input
          type="text"
          placeholder="账号"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, accountId: e.target.value})}
        />
        <input
          type="password"
          placeholder="密码"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <input
          type="text"
          placeholder="昵称"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, nickname: e.target.value})}
        />
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={(e) => setFormData({...formData, reviewer: e.target.checked})}
            />
            评审者
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={(e) => setFormData({...formData, author: e.target.checked})}
            />
            作者
          </label>
        </div>
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          注册
        </button>
      </form>
    </div>
  );
}