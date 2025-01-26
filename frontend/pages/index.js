// frontend/pages/index.js

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Project</h1>
      
      
      <p><Link href="/SubmitPaper">Go to Upload Page</Link></p>
    </div>
  );
}
