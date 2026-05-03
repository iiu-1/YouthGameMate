const store = require('../../utils/store');

Page({
  data: {
    loading: true,
    post: null,
    expired: false,
    comments: [],
    isLiked: false,
    isCollected: false,
    isMine: false,
    commentInput: '',
    postId: ''
  },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ postId: id });
    this.loadPost(id);
  },

  loadPost(id) {
    if (!id) {
      this.setData({ loading: false, post: null });
      return;
    }
    store.bumpView(id);
    const raw = store.getPostById(id);
    if (!raw) {
      this.setData({ loading: false, post: null });
      return;
    }
    const expired = !!raw._expired || raw.status === 'expired';
    const comments = store.getComments(id);
    this.setData({
      loading: false,
      post: raw,
      expired,
      comments,
      isLiked: store.isLiked(id),
      isCollected: store.isCollected(id),
      isMine: raw.userId === store.ME_ID
    });
  },

  confirmDelete() {
    wx.showModal({
      title: '删除帖子',
      content: '删除后无法恢复，确定删除？',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (!res.confirm) return;
        const r = store.deletePost(this.data.postId);
        if (!r.ok) {
          wx.showToast({
            title: r.reason === 'forbidden' ? '无权限' : '删除失败',
            icon: 'none'
          });
          return;
        }
        wx.showToast({ title: '已删除', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 400);
      }
    });
  },

  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },

  submitComment() {
    if (this.data.expired) {
      wx.showToast({ title: '帖子已过期', icon: 'none' });
      return;
    }
    const text = (this.data.commentInput || '').trim();
    if (!text) {
      wx.showToast({ title: '请输入评论', icon: 'none' });
      return;
    }
    const id = this.data.postId;
    store.addComment(id, text);
    this.setData({
      commentInput: '',
      comments: store.getComments(id),
      'post.commentCount': (this.data.post.commentCount || 0) + 1
    });
  },

  toggleLike() {
    if (this.data.expired) return;
    const id = this.data.postId;
    const r = store.toggleLike(id);
    this.setData({
      isLiked: r.liked,
      'post.likeCount': r.likeCount
    });
  },

  toggleCollect() {
    if (this.data.expired) return;
    const id = this.data.postId;
    const collected = store.toggleCollect(id);
    this.setData({ isCollected: collected });
    wx.showToast({
      title: collected ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  goToChat() {
    if (this.data.expired) {
      wx.showToast({ title: '帖子已过期', icon: 'none' });
      return;
    }
    const uid = this.data.post && this.data.post.userId;
    if (!uid) return;
    if (uid === store.ME_ID) {
      wx.showToast({ title: '这是你自己的帖子', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${uid}`
    });
  },

  goToUserHome() {
    const uid = this.data.post && this.data.post.userId;
    if (!uid) return;
    wx.navigateTo({
      url: `/pages/user-home/user-home?id=${uid}`
    });
  }
});
