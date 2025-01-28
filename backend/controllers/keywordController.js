const Paper = require('../models/paper');

exports.getAllKeywords = async (req, res) => {
  try {
    const keywords = await Paper.getAllKeywords();
    res.json({ success: true, keywords });
  } catch (error) {
    console.error('Error getting keywords:', error);
    res.status(500).json({ success: false, message: '获取关键词失败' });
  }
};

exports.updatePaperKeywords = async (req, res) => {
  try {
    const { DID, keywords } = req.body;
    
    if (!DID || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ success: false, message: '无效的参数' });
    }

    await Paper.updateKeywords(DID, keywords);
    res.json({ success: true, message: '关键词更新成功' });
  } catch (error) {
    console.error('Error updating keywords:', error);
    res.status(500).json({ success: false, message: '更新关键词失败' });
  }
};