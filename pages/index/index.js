const store = require('../../utils/store');
const { FILTER_TAGS } = require('../../utils/constants');

Page({
  data: {
    posts: [],
    games: [
      { id: 'all', name: '全部' },
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
    filterTags: FILTER_TAGS,
    filters: {
      game: 'all',
      rank: '',
      gender: '',
      tags: []
    },
    activeGame: 'all',
    showFilter: false
  },

  onLoad() {
    this.applyList();
  },

  onShow() {
    this.applyList();
  },

  applyList() {
    const all = store.getPostsFeed();
    const { activeGame, filters } = this.data;
    const merged = {
      game: activeGame,
      gender: filters.gender,
      rank: filters.rank,
      tags: filters.tags
    };
    const posts = store.filterPosts(all, merged);
    this.setData({ posts });
  },

  onGameTap(e) {
    const game = e.currentTarget.dataset.game;
    this.setData({ activeGame: game });
    this.applyList();
  },

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  setFilterGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ 'filters.gender': gender === undefined ? '' : gender });
  },

  setFilterRank(e) {
    const rank = e.currentTarget.dataset.rank;
    this.setData({ 'filters.rank': rank === undefined ? '' : rank });
  },

  toggleFilterTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const tags = (this.data.filters.tags || []).slice();
    const i = tags.indexOf(tag);
    if (i >= 0) tags.splice(i, 1);
    else tags.push(tag);
    this.setData({ 'filters.tags': tags });
  },

  applyFilters() {
    this.setData({ showFilter: false });
    this.applyList();
  },

  resetFilters() {
    this.setData({
      filters: { game: 'all', rank: '', gender: '', tags: [] },
      activeGame: 'all'
    });
    this.applyList();
  },

  goToDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${postId}`
    });
  },

  onShareAppMessage() {
    return {
      title: '校园游搭子 - 找同校游戏队友',
      path: '/pages/index/index'
    };
  }
});
