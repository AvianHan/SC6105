// frontend/pages/accountSettings.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';


export default function AccountSettings() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');


  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage('');
    
    console.log('Form submission - Old password length:', oldPassword?.length);
    console.log('Form submission - New password length:', newPassword?.length);
    const accountId = JSON.parse(localStorage.getItem('userInfo')).accountId;
  
    try {
      console.log('Making request to updateUser');
      const res = await fetch('http://localhost:3000/auth/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId, oldPassword, newPassword })
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.ok && data.success) {
        setMessage('Password updated successfully!');
        setNewPassword('');
        setOldPassword('');
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error details:', error);
      setMessage('Network error');
    }
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Account Settings - Change Password</h1>
      
      <form onSubmit={handleChangePassword}>
        <div className={styles.inputGroup}>
          <label htmlFor="oldPassword">Current Password:</label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={styles.textInput}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Leave blank if unchanged"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.textInput}
          />
        </div>

        <button type="submit" className={styles.button}>
          Update
        </button>

        {message && (
          <div className={message.includes('error') || message.includes('failed') ? 
            styles.errorMessage : 
            styles.resultContainer}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}