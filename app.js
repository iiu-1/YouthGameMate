const store = require('./utils/store');

App({
  globalData: {
    userInfo: {
      nickName: '本校玩家',
      avatarUrl: ''
    },
    openid: '',
    isAuth: false
  },

  onLaunch() {
    // 勿在未绑定云环境时调用 wx.cloud.init，否则开发者工具易出现 Error: timeout。
    // 接入云开发后：在 app.json 增加 "cloud": true，并在此处填写 env，例如：
    // if (wx.cloud) wx.cloud.init({ env: '你的环境ID', traceUser: true });
    const me = store.getMe();
    this.globalData.openid = me._id;
    this.globalData.userInfo.nickName = me.nickname || '本校玩家';
    this.globalData.userInfo.avatarUrl = me.avatarUrl || '';
    this.globalData.isAuth = me.authStatus === 'verified';
  },

  syncGlobalFromStore() {
    const me = store.getMe();
    this.globalData.openid = me._id;
    this.globalData.userInfo.nickName = me.nickname || '本校玩家';
    this.globalData.userInfo.avatarUrl = me.avatarUrl || '';
    this.globalData.isAuth = me.authStatus === 'verified';
  }
});
