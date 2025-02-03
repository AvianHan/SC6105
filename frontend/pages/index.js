// frontend/pages/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);  // 空依赖数组意味着这个效果只会在组件挂载时运行一次

  // 在重定向发生之前返回一个加载状态或空内容
  return null;
}