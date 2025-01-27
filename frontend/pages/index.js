import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Project</h1>
      
      <p><Link href="/search">论文搜索</Link></p>
      <p><Link href="/SubmitPaper">Go to Upload Page</Link></p>
      <p><Link href="/login">Go to Login Page</Link></p>
    </div>
  );
}