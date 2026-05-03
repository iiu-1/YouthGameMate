const store = require('../../utils/store');

Page({
  data: {
    recommendations: [],
    filters: {
      game: '',
      rank: '',
      sameMajor: false
    },
    loading: false
  },

  onLoad() {
    this.loadRecommendations();
  },

  onShow() {
    this.loadRecommendations();
  },

  loadRecommendations() {
    this.setData({ loading: true });
    const list = store.matchRecommendations(this.data.filters);
    this.setData({ recommendations: list, loading: false });
  },

  toggleSameMajor() {
    this.setData({ 'filters.sameMajor': !this.data.filters.sameMajor });
    this.loadRecommendations();
  },

  goToUserHome(e) {
    const userId = e.currentTarget.dataset.id;
    if (!userId) return;
    wx.navigateTo({
      url: `/pages/user-home/user-home?id=${userId}`
    });
  },

  startChat(e) {
    e.stopPropagation && e.stopPropagation();
    const userId = e.currentTarget.dataset.id;
    if (!userId) return;
    if (store.isBlocked(userId)) {
      wx.showToast({ title: '已拉黑该用户', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${userId}`
    });
  },

  goToProfile() {
    wx.reLaunch({ url: '/pages/profile/profile' });
  }
});