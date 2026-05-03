const store = require('../../utils/store');

Page({
  data: {
    userInfo: {
      nickName: '本校玩家',
      avatarUrl: '',
      hasWxAuth: false
    },
    authStatus: 'none',
    stats: {
      postCount: 0,
      collectCount: 0,
      followCount: 0
    },
    menuItems: [
      { icon: '📝', title: '我的帖子' },
      { icon: '⭐', title: '我的收藏' },
      { icon: '⚙️', title: '编辑资料' }
    ]
  },

  onShow() {
    const me = store.getMe();
    const feed = store.getPostsFeed();
    const myPosts = feed.filter((p) => p.userId === me._id).length;
    const collectCount = store.getCollectedPosts().length;
    this.setData({
      userInfo: {
        nickName: me.nickname || '本校玩家',
        avatarUrl: me.avatarUrl || '',
        hasWxAuth: !!me.hasWxAuth
      },
      authStatus: me.authStatus || 'none',
      stats: {
        postCount: myPosts,
        collectCount: collectCount,
        followCount: store.followCount()
      }
    });
    const app = getApp();
    if (app && app.syncGlobalFromStore) app.syncGlobalFromStore();
  },

  wxLogin() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo;
        store.updateMe({
          nickname: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          hasWxAuth: true
        });
        wx.showToast({ title: '登录成功', icon: 'success' });
        this.onShow();
      },
      fail: (err) => {
        wx.showToast({ title: '登录失败', icon: 'none' });
        console.log('wx.getUserProfile fail:', err);
      }
    });
  },

  goToMenu(e) {
    const title = e.currentTarget.dataset.title;
    if (title === '编辑资料') {
      wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
    } else if (title === '我的帖子') {
      wx.navigateTo({ url: '/pages/my-list/my-list?type=posts' });
    } else if (title === '我的收藏') {
      wx.navigateTo({ url: '/pages/my-list/my-list?type=collects' });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  },

  goToEditProfile() {
    wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
  }
});