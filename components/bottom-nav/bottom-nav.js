const TABS = [
  { path: '/pages/index/index', key: 'index', label: '广场' },
  { path: '/pages/match/match', key: 'match', label: '匹配' },
  { path: '/pages/publish/publish', key: 'publish', label: '发布' },
  { path: '/pages/message/message', key: 'message', label: '消息' },
  { path: '/pages/profile/profile', key: 'profile', label: '我的' }
];

Component({
  properties: {
    active: {
      type: String,
      value: 'index'
    }
  },
  data: {
    tabs: TABS
  },
  methods: {
    onTap(e) {
      const key = e.currentTarget.dataset.key;
      const tab = TABS.find((t) => t.key === key);
      if (!tab || tab.key === this.properties.active) return;
      wx.reLaunch({ url: tab.path });
    }
  }
});
