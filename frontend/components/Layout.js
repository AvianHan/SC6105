import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  // 检查登录状态的函数
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (token && storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        handleSignOut();
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    // 初始检查登录状态
    checkLoginStatus();

    // 添加登录状态变化的事件监听器
    const handleLoginStateChange = () => {
      checkLoginStatus();
    };

    // 添加存储变化的事件监听器
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userInfo') {
        checkLoginStatus();
      }
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);
    window.addEventListener('storage', handleStorageChange);

    // 清理事件监听器
    return () => {
      window.removeEventListener('loginStateChange', handleLoginStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
    setMenuOpen(false);
    router.push('/search');
  };

  const displayName = userInfo?.nickname || userInfo?.accountId || 'Menu';

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/search">Academic Paper Platform</Link>
        </div>

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

          <div className={styles.userMenu}>
            <div
              className={styles.userName}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {displayName}
            </div>
            {menuOpen && (
              <div className={styles.dropdown}>
                <Link href="/search" className={styles.dropdownItem}>Home</Link>
                {isLoggedIn ? (
                  <>
                    <Link href="/SubmitPaper" className={styles.dropdownItem}>Upload Paper</Link>
                    {userInfo?.reviewer && (
                      <Link href="/myReviews" className={styles.dropdownItem}>Peer Review</Link>
                    )}
                    {/* 修改这部分条件渲染的写法 当不是作者时不显示My Papers选项*/}
                    {userInfo?.author ? (
                      <Link href="/profile" className={styles.dropdownItem}>My Papers</Link>
                    ) : null}
                    <div className={styles.dropdownDivider} />
                    <Link href="/profile" className={styles.dropdownItem}>Account Settings</Link>
                    <div className={styles.dropdownDivider} />
                    <div className={styles.dropdownItem} onClick={handleSignOut}>
                      Sign out
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.dropdownDivider} />
                    <Link href="/login" className={styles.dropdownItem}>Login</Link>
                    <Link href="/register" className={styles.dropdownItem}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}