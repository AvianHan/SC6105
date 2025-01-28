// frontend/components/Layout.js
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 示例：假设已登录
  const isLoggedIn = true;
  const userName = 'John Doe';

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
  };

  const handleSignOut = () => {
    alert('Signed out!');
  };

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">Academic Paper Platform</Link>
        </div>

        <nav className={styles.navTabs}>
          <Link href="/">Papers</Link>
          <Link href="/SubmitPaper">Submit Paper</Link>
          <Link href="/myReviews">Peer Review</Link>
          <Link href="/profile">My Papers</Link>
        </nav>

        <div className={styles.headerRight}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>

          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <div
                className={styles.userName}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {userName}
              </div>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <Link href="/profile">Account Settings</Link>
                  <div className={styles.dropdownDivider} />
                  <div className={styles.dropdownItem} onClick={handleSignOut}>
                    Sign out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Link href="/login">Login</Link> |{' '}
              <Link href="/register">Register</Link>
            </div>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
