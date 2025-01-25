import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [papers, setPapers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/papers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPapers(data);
        }
      } catch (error) {
        console.error('获取论文失败:', error);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">我的论文</h2>
        <div className="grid gap-4">
          {papers.map((paper) => (
            <div key={paper.DID} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{paper.title}</h3>
              <p className="text-gray-600 mt-2">{paper.abstract}</p>
              <p className="text-sm text-gray-500 mt-2">关键词: {paper.keyword}</p>
              <p className="text-sm text-gray-500">发布时间: {new Date(paper.timestamp).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}