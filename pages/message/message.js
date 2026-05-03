const store = require('../../utils/store');

Page({
  data: {
    activeTab: 'private',
    conversations: [],
    systemNotifications: [],
    loading: false
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData({ loading: true });
    const conversations = store.getConversationsForUi();
    const systemNotifications = store.getSystemNotes();
    this.setData({
      conversations,
      systemNotifications,
      loading: false
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  goToChat(e) {
    const convId = e.currentTarget.dataset.id;
    const otherUserId = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: `/pages/chat/chat?convId=${convId}&userId=${otherUserId}`
    });
  }
});
