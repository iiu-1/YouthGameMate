const store = require('../../utils/store');
const { GAME_NAME } = require('../../utils/constants');

Page({
  data: {
    loading: true,
    userId: '',
    userProfile: null,
    gameLabels: [],
    posts: [],
    isFollowing: false
  },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ userId: id });
    this.loadUser(id);
  },

  loadUser(id) {
    if (!id) {
      this.setData({ loading: false, userProfile: null });
      return;
    }
    const u = store.getUser(id);
    if (!u) {
      this.setData({ loading: false, userProfile: null });
      return;
    }
    const gameLabels = (u.games || []).map((gid) => GAME_NAME[gid] || gid);
    const posts = store.getPostsByUser(id);
    this.setData({
      loading: false,
      userProfile: {
        ...u,
        positions: u.positions || []
      },
      gameLabels,
      posts,
      isFollowing: store.isFollowing(id)
    });
    wx.setNavigationBarTitle({ title: u.nickname || '用户主页' });
  },

  toggleFollow() {
    const id = this.data.userId;
    const on = store.toggleFollow(id);
    this.setData({ isFollowing: on });
    wx.showToast({
      title: on ? '已关注' : '已取消关注',
      icon: 'none'
    });
  },

  goToChat() {
    const id = this.data.userId;
    if (!id) return;
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${id}`
    });
  },

  goToPostDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${postId}`
    });
  }
});
