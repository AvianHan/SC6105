// frontend/pages/accountSettings.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AccountSettings() {
  const router = useRouter();
  
  // we only keep "newPassword"
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // if not logged in, redirect
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage('');

    // check again
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/auth/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // only pass newPassword
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Password updated successfully!');
        setNewPassword('');
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage('Network error');
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Account Settings - Change Password</h1>

      <form onSubmit={handleChangePassword} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>New Password:</label>
          <br />
          <input
            type="password"
            placeholder="Leave blank if unchanged"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit">
          Update
        </button>
        
        {message && (
          <div style={{ marginTop: '10px', color: 'green' }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
