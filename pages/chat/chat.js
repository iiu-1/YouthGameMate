const store = require('../../utils/store');

Page({
  data: {
    loading: true,
    meId: '',
    convId: '',
    peerId: '',
    otherUser: { nickname: '', dormitory: '', avatarUrl: '' },
    userInfo: { nickName: '', avatarUrl: '' },
    messages: [],
    inputValue: ''
  },

  onLoad(options) {
    const me = store.getMe();
    let peerId = options.userId || '';
    const convIdParam = options.convId || '';

    if (convIdParam && !peerId) {
      const c = store.getConversationById(convIdParam);
      if (c) peerId = c.peerId;
    }

    if (!peerId) {
      this.setData({ loading: false });
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }

    if (store.isBlocked(peerId)) {
      this.setData({ loading: false });
      wx.showToast({ title: '已拉黑该用户', icon: 'none' });
      return;
    }

    const conv = store.getOrCreateConversation(peerId);
    if (!conv) {
      this.setData({ loading: false });
      wx.showToast({ title: '无法与自己聊天', icon: 'none' });
      return;
    }

    store.markConvRead(conv._id);

    const other = store.getUser(peerId) || { nickname: '用户', dormitory: '' };

    this.setData({
      loading: false,
      meId: me._id,
      convId: conv._id,
      peerId,
      otherUser: { nickname: other.nickname || '用户', dormitory: other.dormitory || '', avatarUrl: other.avatarUrl || '' },
      userInfo: { nickName: me.nickname || '我', avatarUrl: me.avatarUrl || '' },
      messages: store.getMessages(conv._id)
    });

    wx.setNavigationBarTitle({ title: other.nickname || '私聊' });
  },

  goToUserHome() {
    const { peerId } = this.data;
    wx.navigateTo({
      url: `/pages/user-home/user-home?id=${peerId}`
    });
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  sendMessage() {
    const { inputValue, convId, peerId } = this.data;
    const text = (inputValue || '').trim();
    if (!text) return;

    store.sendChatMessage(convId, peerId, text);
    this.setData({
      messages: store.getMessages(convId),
      inputValue: ''
    });
  }
});
