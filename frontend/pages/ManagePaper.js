// frontend/pages/ManagePaper.js

function ManagePaper({ paperId }) {
    const [reviewerId, setReviewerId] = useState('');
  
    const handleInvite = async () => {
      try {
        const res = await fetch('/paper/inviteReviewer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paperId, reviewerId }),
        });
        const data = await res.json();
        if (data.success) {
          alert('邀请成功！');
        } else {
          alert('邀请失败: ' + data.message);
        }
      } catch(e) {
        console.error(e);
        alert('请求出错');
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Reviewer ID"
          value={reviewerId}
          onChange={(e) => setReviewerId(e.target.value)}
        />
        <button onClick={handleInvite}>邀请审稿人</button>
      </div>
    );
  }
  