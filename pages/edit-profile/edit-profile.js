const store = require('../../utils/store');
const { GAME_NAME } = require('../../utils/constants');

Page({
  data: {
    showGamePicker: false,
    showGradePicker: false,
    showTimePicker: false,
    formData: {
      nickname: '本校玩家',
      gender: 1,
      grade: '大二',
      games: ['wangzhe', 'valorant'],
      onlineTime: '晚上',
      voiceEnabled: true,
      bio: ''
    },
    allGames: [
      { id: 'wangzhe', name: '王者荣耀' },
      { id: 'heping', name: '和平精英' },
      { id: 'valorant', name: '无畏契约' },
      { id: 'delta', name: '三角洲行动' },
      { id: 'yongjie', name: '永劫无间' },
      { id: 'steam', name: 'Steam联机' },
      { id: 'luokeworld', name: '洛克王国:世界' },
      { id: 'danzai', name: '蛋仔派对' },
      { id: 'lol', name: '英雄联盟' },
      { id: 'cs2', name: 'CS2' },
      { id: 'other', name: '其他' }
    ],
    allGrades: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
    allTimes: ['早上', '下午', '晚上', '凌晨'],
    gamesDisplay: ''
  },

  onLoad() {
    const me = store.getMe();
    const formData = {
      nickname: me.nickname || '本校玩家',
      avatarUrl: me.avatarUrl || '',
      gender: typeof me.gender === 'number' ? me.gender : 1,
      grade: me.grade || '大二',
      games: me.games && me.games.length ? me.games : ['wangzhe'],
      onlineTime: me.onlineTime || '晚上',
      voiceEnabled: !!me.voiceEnabled,
      bio: me.bio || ''
    };
    this.setData({
      formData,
      gamesDisplay: this.formatGames(formData.games)
    });
  },

  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'formData.avatarUrl': tempFilePath
        });
      },
      fail: (err) => {
        console.log('chooseImage fail:', err);
      }
    });
  },

  formatGames(ids) {
    return (ids || []).map((id) => GAME_NAME[id] || id).join('、');
  },

  toggleGamePicker() {
    this.setData({ showGamePicker: !this.data.showGamePicker });
  },

  toggleGradePicker() {
    this.setData({ showGradePicker: !this.data.showGradePicker });
  },

  toggleTimePicker() {
    this.setData({ showTimePicker: !this.data.showTimePicker });
  },

  selectGame(e) {
    const game = e.currentTarget.dataset.game;
    const games = this.data.formData.games.slice();
    const index = games.indexOf(game);

    if (index > -1) {
      games.splice(index, 1);
      wx.showToast({ title: '已取消选择', icon: 'none', duration: 1000 });
    } else if (games.length < 5) {
      games.push(game);
      const gameName = GAME_NAME[game] || game;
      wx.showToast({ title: `已添加${gameName}`, icon: 'success', duration: 1000 });
    } else {
      wx.showToast({ title: '最多选择5个游戏', icon: 'none' });
      return;
    }

    this.setData({
      'formData.games': games,
      gamesDisplay: this.formatGames(games)
    });
  },

  selectGrade(e) {
    this.setData({ 'formData.grade': e.currentTarget.dataset.grade });
  },

  selectTime(e) {
    const t = e.currentTarget.dataset.time;
    this.setData({ 'formData.onlineTime': t });
  },

  toggleVoice(e) {
    this.setData({ 'formData.voiceEnabled': !!e.detail.value });
  },

  onNicknameInput(e) {
    this.setData({ 'formData.nickname': e.detail.value });
  },

  onBioInput(e) {
    this.setData({ 'formData.bio': e.detail.value });
  },

  setGender(e) {
    const g = Number(e.currentTarget.dataset.gender);
    this.setData({ 'formData.gender': g });
  },

  saveProfile() {
    const { formData } = this.data;

    if (!formData.nickname.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中...' });

    try {
      store.saveMe({
        nickname: formData.nickname.trim(),
        avatarUrl: formData.avatarUrl,
        gender: formData.gender,
        grade: formData.grade,
        games: formData.games,
        onlineTime: formData.onlineTime,
        voiceEnabled: formData.voiceEnabled,
        bio: formData.bio
      });
      const app = getApp();
      if (app && app.syncGlobalFromStore) app.syncGlobalFromStore();
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  }
});