// frontend/pages/index.js
export default function HomePage() {
  // 即使渲染到客户端，这里也不会显示，因为服务器端会先跳转
  return <div>Redirecting...</div>;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/search',
      permanent: false,
    },
  };
}
