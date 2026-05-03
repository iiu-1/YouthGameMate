const store = require('../../utils/store');

Page({
  data: {
    type: 'posts',
    title: '我的帖子',
    posts: []
  },

  onLoad(options) {
    const type = options.type === 'collects' ? 'collects' : 'posts';
    this.setData({
      type,
      title: type === 'collects' ? '我的收藏' : '我的帖子'
    });
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    let posts;
    if (this.data.type === 'collects') {
      posts = store.getCollectedPosts();
    } else {
      const feed = store.getPostsFeed();
      const me = store.getMe();
      posts = feed.filter((p) => p.userId === me._id);
    }
    this.setData({ posts });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/post-detail/post-detail?id=${id}` });
  },

  onDeletePost(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.showModal({
      title: '删除帖子',
      content: '删除后无法恢复，确定删除？',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (!res.confirm) return;
        const r = store.deletePost(id);
        if (!r.ok) {
          wx.showToast({ title: '删除失败', icon: 'none' });
          return;
        }
        wx.showToast({ title: '已删除', icon: 'success' });
        this.refresh();
      }
    });
  }
});
