// frontend/pages/ReviewPaper.js

function ReviewPaper({ paperId }) {
    const [reviewContent, setReviewContent] = useState('');
  
    const handleSubmitReview = async () => {
      try {
        const res = await fetch('/paper/submitReview', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ paperId, content: reviewContent }),
        });
        const data = await res.json();
        if (data.success) {
          alert('审稿提交成功');
        } else {
          alert('提交失败: ' + data.message);
        }
      } catch(e) {
        console.error(e);
        alert('请求出错');
      }
    };
  
    return (
      <div>
        <h2>对论文 {paperId} 提交审稿</h2>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />
        <button onClick={handleSubmitReview}>提交审稿</button>
      </div>
    );
  }
  