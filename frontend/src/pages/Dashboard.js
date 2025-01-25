import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">欢迎, {user?.nickname}</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            登出
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">用户信息</h2>
          <p>账号ID: {user?.accountId}</p>
          <p>角色: {user?.reviewer ? '审稿人' : ''} {user?.author ? '作者' : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;