const store = require('../../utils/store');

const GAME_ICON_PNG_IDS = new Set([
  'wangzhe',
  'heping',
  'valorant',
  'delta',
  'yongjie',
  'steam',
  'luokeworld',
  'danzai',
  'lol',
  'cs2'
]);

function gameIconSrc(id) {
  if (GAME_ICON_PNG_IDS.has(id)) return `/images/games/${id}.png`;
  return `/images/games/${id}.svg`;
}

Page({
  data: {
    gameList: [
      { id: 'wangzhe', name: '王者荣耀', iconSrc: gameIconSrc('wangzhe') },
      { id: 'heping', name: '和平精英', iconSrc: gameIconSrc('heping') },
      { id: 'valorant', name: '无畏契约', iconSrc: gameIconSrc('valorant') },
      { id: 'delta', name: '三角洲行动', iconSrc: gameIconSrc('delta') },
      { id: 'yongjie', name: '永劫无间', iconSrc: gameIconSrc('yongjie') },
      { id: 'steam', name: 'Steam联机', iconSrc: gameIconSrc('steam') },
      { id: 'luokeworld', name: '洛克王国:世界', iconSrc: gameIconSrc('luokeworld') },
      { id: 'danzai', name: '蛋仔派对', iconSrc: gameIconSrc('danzai') },
      { id: 'lol', name: '英雄联盟', iconSrc: gameIconSrc('lol') },
      { id: 'cs2', name: 'CS2', iconSrc: gameIconSrc('cs2') },
      { id: 'other', name: '其他', iconEmoji: '✨' }
    ],
    durationList: [
      { value: 1, label: '1天' },
      { value: 3, label: '3天' },
      { value: 7, label: '7天' },
      { value: 0, label: '永久' }
    ],
    availableTags: ['可语音', '佛系上分', '娱乐唠嗑', '新手带飞', '上分冲段', '娱乐为主', '妹子优先', '夜间玩家'],

    formData: {
      game: 'wangzhe',
      gameName: '王者荣耀',
      title: '',
      content: '',
      peopleCount: 2,
      duration: 3,
      tags: [],
      gender: '',
      onlySchool: true
    },

    selectedGame: null,
    showGamePicker: false,
    step: 1
  },

  onLoad() {
    const g = this.data.gameList[0];
    this.setData({
      selectedGame: g,
      'formData.game': g.id,
      'formData.gameName': g.name
    });
  },

  selectGame(e) {
    const id = e.currentTarget.dataset.id;
    const game = (this.data.gameList || []).find((g) => g.id === id);
    if (!game) return;
    this.setData({
      'formData.game': game.id,
      'formData.gameName': game.name,
      selectedGame: game,
      showGamePicker: false
    });
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const tags = this.data.formData.tags;
    const index = tags.indexOf(tag);

    if (index > -1) {
      tags.splice(index, 1);
    } else if (tags.length < 5) {
      tags.push(tag);
    } else {
      wx.showToast({ title: '最多选择5个标签', icon: 'none' });
      return;
    }

    this.setData({ 'formData.tags': tags });
  },

  setDuration(e) {
    this.setData({
      'formData.duration': e.currentTarget.dataset.value
    });
  },

  setGender(e) {
    this.setData({
      'formData.gender': e.currentTarget.dataset.gender
    });
  },

  onTitleInput(e) {
    this.setData({ 'formData.title': e.detail.value });
  },

  onContentInput(e) {
    this.setData({ 'formData.content': e.detail.value });
  },

  adjustPeopleCount(e) {
    const type = e.currentTarget.dataset.type;
    let count = this.data.formData.peopleCount;
    if (type === 'add' && count < 10) {
      count++;
    } else if (type === 'minus' && count > 2) {
      count--;
    }
    this.setData({ 'formData.peopleCount': count });
  },

  toggleOnlySchool(e) {
    const v = e.detail.value;
    this.setData({ 'formData.onlySchool': !!v });
  },

  nextStep() {
    if (this.data.step === 1 && !this.data.formData.game) {
      wx.showToast({ title: '请选择游戏', icon: 'none' });
      return;
    }
    this.setData({ step: this.data.step + 1 });
  },

  prevStep() {
    this.setData({ step: this.data.step - 1 });
  },

  submitPost() {
    const { formData } = this.data;

    if (!formData.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!formData.content.trim()) {
      wx.showToast({ title: '请输入详情内容', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '发布中...' });

    try {
      store.addPost({
        game: formData.game,
        gameName: formData.gameName,
        title: formData.title,
        content: formData.content,
        peopleCount: formData.peopleCount,
        gender: formData.gender,
        tags: formData.tags,
        duration: formData.duration,
        onlySchool: formData.onlySchool
      });
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/index/index' });
      }, 600);
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '发布失败', icon: 'none' });
    }
  }
});
