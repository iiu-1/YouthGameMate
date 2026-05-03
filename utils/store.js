const { GAME_NAME, SENSITIVE_WORDS } = require('./constants');
const { timeAgo, formatTime } = require('./time');

const STORAGE_KEY = 'campus_buddy_store_v1';
const ME_ID = 'local_me_openid';

function sanitizeText(text) {
  if (!text || typeof text !== 'string') return text;
  let out = text;
  SENSITIVE_WORDS.forEach((w) => {
    if (!w) return;
    const reg = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    out = out.replace(reg, '**');
  });
  return out;
}

function loadRaw() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    return null;
  }
}

function saveRaw(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, data);
  } catch (e) {
    console.error('store save failed', e);
  }
}

function seedState() {
  const now = Date.now();
  const seedUsers = {
    u_seed_1: {
      _id: 'u_seed_1',
      nickname: '游戏达人',
      avatarUrl: '',
      gender: 1,
      grade: '大三',
      dormitory: '1号楼',
      games: ['wangzhe', 'heping'],
      rank: '星耀',
      positions: ['中路', '射手'],
      onlineTime: ['晚上'],
      voiceEnabled: true,
      bio: '佛系上分，可语音。',
      authStatus: 'verified'
    },
    u_seed_2: {
      _id: 'u_seed_2',
      nickname: '小可爱',
      avatarUrl: '',
      gender: 0,
      grade: '大二',
      dormitory: '3号楼',
      games: ['heping', 'steam'],
      rank: '王牌',
      positions: ['指挥', '突击'],
      onlineTime: ['下午'],
      voiceEnabled: true,
      bio: '娱乐为主，周末在线。',
      authStatus: 'pending'
    }
  };

  const posts = [
    {
      _id: 'seed_post_1',
      userId: 'u_seed_1',
      userInfo: { nickname: '游戏达人', avatarUrl: '' },
      game: 'wangzhe',
      gameName: GAME_NAME.wangzhe,
      title: '求带王者上分',
      content: '星耀段位，找个队友一起双排，可语音，佛系上分',
      rank: '星耀',
      peopleCount: 2,
      genderReq: '',
      tags: ['可语音', '佛系上分'],
      building: '1号楼',
      authorGender: 'male',
      likeCount: 5,
      commentCount: 2,
      viewCount: 128,
      createTime: now - 10 * 60 * 1000,
      duration: 3,
      onlySchool: true,
      status: 'active',
      expireTime: now + 3 * 24 * 60 * 60 * 1000
    },
    {
      _id: 'seed_post_2',
      userId: 'u_seed_2',
      userInfo: { nickname: '小可爱', avatarUrl: '' },
      game: 'heping',
      gameName: GAME_NAME.heping,
      title: '吃鸡组队',
      content: '王牌段位，周末下午在线，找队友',
      rank: '王牌',
      peopleCount: 4,
      genderReq: '',
      tags: ['娱乐唠嗑'],
      building: '3号楼',
      authorGender: 'female',
      likeCount: 8,
      commentCount: 1,
      viewCount: 56,
      createTime: now - 30 * 60 * 1000,
      duration: 1,
      onlySchool: true,
      status: 'active',
      expireTime: now + 24 * 60 * 60 * 1000
    }
  ];

  const comments = {
    seed_post_1: [
      {
        _id: 'seed_c1',
        userId: 'u_seed_2',
        userInfo: { nickname: '小可爱', avatarUrl: '' },
        content: '我也是星耀，一起玩呀',
        createTime: now - 5 * 60 * 1000
      },
      {
        _id: 'seed_c2',
        userId: ME_ID,
        userInfo: { nickname: '我', avatarUrl: '' },
        content: '求带',
        createTime: now - 12 * 60 * 1000
      }
    ],
    seed_post_2: [
      {
        _id: 'seed_c3',
        userId: 'u_seed_1',
        userInfo: { nickname: '游戏达人', avatarUrl: '' },
        content: '周末下午可以',
        createTime: now - 20 * 60 * 1000
      }
    ]
  };

  const me = {
    _id: ME_ID,
    nickname: '本校玩家',
    avatarUrl: '',
    gender: 1,
    grade: '大二',
    dormitory: '2号楼',
    games: ['wangzhe', 'valorant'],
    rank: '钻石',
    positions: ['打野', '辅助'],
    onlineTime: ['晚上'],
    voiceEnabled: true,
    bio: '找同校开黑队友',
    authStatus: 'none'
  };

  return {
    me,
    users: { ...seedUsers, [ME_ID]: { ...me } },
    posts,
    comments,
    likes: {},
    collections: [],
    follows: {},
    blocks: [],
    conversations: [
      {
        _id: 'seed_conv_1',
        peerId: 'u_seed_1',
        lastMessage: '一起玩吗？',
        lastMessageTime: now - 2 * 60 * 1000,
        unreadCount: 0
      },
      {
        _id: 'seed_conv_2',
        peerId: 'u_seed_2',
        lastMessage: '好的呀',
        lastMessageTime: now - 10 * 60 * 1000,
        unreadCount: 1
      }
    ],
    messages: {
      seed_conv_1: [
        {
          _id: 'm1',
          senderId: 'u_seed_1',
          content: '你好呀',
          createTime: now - 40 * 60 * 1000
        },
        {
          _id: 'm2',
          senderId: ME_ID,
          content: '你好，想一起玩游戏吗？',
          createTime: now - 39 * 60 * 1000
        },
        {
          _id: 'm3',
          senderId: 'u_seed_1',
          content: '可以啊，你玩什么段位？',
          createTime: now - 38 * 60 * 1000
        }
      ],
      seed_conv_2: [
        {
          _id: 'm4',
          senderId: 'u_seed_2',
          content: '好的呀',
          createTime: now - 10 * 60 * 1000
        }
      ]
    },
    systemNotes: [
      {
        _id: 'sys1',
        title: '欢迎使用校园游搭子',
        content: '请完成校园认证，仅与同校同学组队更安全。',
        createTime: now - 60 * 60 * 1000
      }
    ],
    authDraft: null
  };
}

function ensureState() {
  let state = loadRaw();
  if (!state || !state.posts || !state.me) {
    state = seedState();
    saveRaw(state);
  }
  if (!state.users[state.me._id]) {
    state.users[state.me._id] = { ...state.me };
    saveRaw(state);
  }
  return state;
}

function persist(state) {
  saveRaw(state);
}

function getMe() {
  const s = ensureState();
  return { ...s.me };
}

function updateMe(profile) {
  const s = ensureState();
  const next = { ...s.me, ...profile, _id: ME_ID };
  s.me = next;
  s.users[ME_ID] = { ...next };
  persist(s);
  return getMe();
}

function saveMe(profile) {
  const s = ensureState();
  const next = { ...s.me, ...profile, _id: ME_ID };
  s.me = next;
  s.users[ME_ID] = { ...next };
  persist(s);
  return getMe();
}

function getUser(userId) {
  const s = ensureState();
  return s.users[userId] ? { ...s.users[userId] } : null;
}

function listUsersExcept(meId) {
  const s = ensureState();
  return Object.keys(s.users)
    .filter((id) => id !== meId)
    .map((id) => ({ ...s.users[id] }));
}

function isBlocked(peerId) {
  const s = ensureState();
  return (s.blocks || []).indexOf(peerId) >= 0;
}

function toggleBlock(peerId) {
  const s = ensureState();
  s.blocks = s.blocks || [];
  const i = s.blocks.indexOf(peerId);
  if (i >= 0) s.blocks.splice(i, 1);
  else s.blocks.push(peerId);
  persist(s);
  return s.blocks.indexOf(peerId) >= 0;
}

function expireCheck(post) {
  if (post.status !== 'active') return post;
  if (post.expireTime && Date.now() > post.expireTime) {
    return { ...post, status: 'expired' };
  }
  return post;
}

function getPostsFeed() {
  const s = ensureState();
  let list = s.posts.map((p) => expireCheck(p));
  list.forEach((p, i) => {
    if (p.status === 'expired' && s.posts[i].status === 'active') {
      s.posts[i] = { ...s.posts[i], status: 'expired' };
    }
  });
  persist(s);
  return list
    .filter((p) => p.status === 'active')
    .sort((a, b) => b.createTime - a.createTime)
    .map(enrichPostListItem);
}

function enrichPostListItem(p) {
  return {
    ...p,
    timeAgo: timeAgo(p.createTime),
    nickName: p.userInfo && p.userInfo.nickname ? p.userInfo.nickname : '用户'
  };
}

function filterPosts(list, { game, gender, tags }) {
  return list.filter((p) => {
    if (game && game !== 'all' && p.game !== game) return false;
    if (gender && p.authorGender !== gender) return false;
    if (tags && tags.length) {
      const has = tags.some((t) => (p.tags || []).indexOf(t) >= 0);
      if (!has) return false;
    }
    return true;
  });
}

function getPostById(id) {
  const s = ensureState();
  const raw = s.posts.find((p) => p._id === id);
  if (!raw) return null;
  const p = expireCheck(raw);
  if (p.status === 'expired') {
    const idx = s.posts.findIndex((x) => x._id === id);
    if (idx >= 0 && s.posts[idx].status === 'active') {
      s.posts[idx] = { ...s.posts[idx], status: 'expired' };
      persist(s);
    }
  }
  const withTime = { ...p, createTime: timeAgo(p.createTime) };
  if (p.status !== 'active') return { ...withTime, _expired: true };
  return withTime;
}

function bumpView(id) {
  const s = ensureState();
  const idx = s.posts.findIndex((p) => p._id === id);
  if (idx < 0) return;
  s.posts[idx] = { ...s.posts[idx], viewCount: (s.posts[idx].viewCount || 0) + 1 };
  persist(s);
}

function addPost(payload) {
  const s = ensureState();
  const me = s.me;
  const now = Date.now();
  const duration = payload.duration;
  let expireTime = null;
  if (duration && duration > 0) {
    expireTime = now + duration * 24 * 60 * 60 * 1000;
  } else {
    expireTime = null;
  }
  const authorGender = me.gender === 1 ? 'male' : me.gender === 0 ? 'female' : '';
  const post = {
    _id: 'p_' + now,
    userId: me._id,
    userInfo: { nickname: me.nickname, avatarUrl: me.avatarUrl || '' },
    game: payload.game,
    gameName: payload.gameName || GAME_NAME[payload.game] || payload.game,
    title: sanitizeText((payload.title || '').trim()),
    content: sanitizeText((payload.content || '').trim()),
    rank: payload.rank || '',
    peopleCount: payload.peopleCount || 2,
    genderReq: payload.gender || '',
    tags: payload.tags || [],
    building: me.dormitory || '',
    authorGender,
    likeCount: 0,
    commentCount: 0,
    viewCount: 0,
    createTime: now,
    duration: duration || 0,
    onlySchool: !!payload.onlySchool,
    status: 'active',
    expireTime: expireTime
  };
  s.posts.unshift(post);
  if (!s.comments[post._id]) s.comments[post._id] = [];
  persist(s);
  return post._id;
}

function getComments(postId) {
  const s = ensureState();
  const list = (s.comments[postId] || []).slice();
  return list
    .sort((a, b) => a.createTime - b.createTime)
    .map((c) => ({
      ...c,
      createTime: timeAgo(c.createTime)
    }));
}

function addComment(postId, content) {
  const s = ensureState();
  const text = sanitizeText((content || '').trim());
  if (!text) return null;
  const me = s.me;
  const c = {
    _id: 'c_' + Date.now(),
    userId: me._id,
    userInfo: { nickname: me.nickname, avatarUrl: me.avatarUrl || '' },
    content: text,
    createTime: Date.now()
  };
  if (!s.comments[postId]) s.comments[postId] = [];
  s.comments[postId].push(c);
  const idx = s.posts.findIndex((p) => p._id === postId);
  if (idx >= 0) {
    s.posts[idx] = {
      ...s.posts[idx],
      commentCount: (s.posts[idx].commentCount || 0) + 1
    };
  }
  persist(s);
  return c;
}

function isLiked(postId) {
  const s = ensureState();
  return !!(s.likes && s.likes[postId]);
}

function toggleLike(postId) {
  const s = ensureState();
  s.likes = s.likes || {};
  const on = !s.likes[postId];
  s.likes[postId] = on;
  const idx = s.posts.findIndex((p) => p._id === postId);
  if (idx >= 0) {
    const delta = on ? 1 : -1;
    s.posts[idx] = {
      ...s.posts[idx],
      likeCount: Math.max(0, (s.posts[idx].likeCount || 0) + delta)
    };
  }
  persist(s);
  return { liked: on, likeCount: idx >= 0 ? s.posts[idx].likeCount : 0 };
}

function isCollected(postId) {
  const s = ensureState();
  return (s.collections || []).indexOf(postId) >= 0;
}

function toggleCollect(postId) {
  const s = ensureState();
  s.collections = s.collections || [];
  const i = s.collections.indexOf(postId);
  if (i >= 0) s.collections.splice(i, 1);
  else s.collections.push(postId);
  persist(s);
  return s.collections.indexOf(postId) >= 0;
}

function deletePost(postId) {
  const s = ensureState();
  const idx = s.posts.findIndex((p) => p._id === postId);
  if (idx < 0) return { ok: false, reason: 'not_found' };
  if (s.posts[idx].userId !== s.me._id) return { ok: false, reason: 'forbidden' };
  s.posts.splice(idx, 1);
  if (s.comments && s.comments[postId]) delete s.comments[postId];
  if (s.likes && s.likes[postId]) delete s.likes[postId];
  s.collections = (s.collections || []).filter((id) => id !== postId);
  persist(s);
  return { ok: true };
}

function getMyPostIds() {
  const s = ensureState();
  return s.posts.filter((p) => p.userId === s.me._id).map((p) => p._id);
}

function getCollectedPosts() {
  const s = ensureState();
  const ids = s.collections || [];
  return ids
    .map((id) => s.posts.find((p) => p._id === id))
    .filter(Boolean)
    .map(enrichPostListItem);
}

function getPostsByUser(userId) {
  const s = ensureState();
  return s.posts
    .filter((p) => p.userId === userId && p.status === 'active')
    .sort((a, b) => b.createTime - a.createTime)
    .map((p) => ({
      _id: p._id,
      title: p.title,
      gameName: p.gameName,
      createTime: timeAgo(p.createTime),
      likeCount: p.likeCount || 0
    }));
}

function submitAuth(form) {
  const s = ensureState();
  s.authDraft = { ...form, createTime: Date.now() };
  s.me = { ...s.me, authStatus: 'pending' };
  s.users[s.me._id] = { ...s.me };
  s.systemNotes = s.systemNotes || [];
  s.systemNotes.unshift({
    _id: 'sys_auth_' + Date.now(),
    title: '校园认证已提交',
    content: '管理员审核通过后将展示认证标识。',
    createTime: Date.now()
  });
  persist(s);
}

function getConversationsForUi() {
  const s = ensureState();
  return (s.conversations || [])
    .slice()
    .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
    .map((c) => {
      const u = s.users[c.peerId];
      return {
        _id: c._id,
        lastMessage: c.lastMessage,
        lastMessageTime: timeAgo(c.lastMessageTime),
        unreadCount: c.unreadCount || 0,
        otherUser: {
          _openid: c.peerId,
          nickname: u ? u.nickname : '用户',
          building: u ? u.dormitory : ''
        }
      };
    });
}

function getConversationById(convId) {
  const s = ensureState();
  return (s.conversations || []).find((c) => c._id === convId) || null;
}

function getOrCreateConversation(peerId) {
  const s = ensureState();
  if (peerId === s.me._id) return null;
  let c = (s.conversations || []).find((x) => x.peerId === peerId);
  if (!c) {
    c = {
      _id: 'conv_' + Date.now(),
      peerId,
      lastMessage: '',
      lastMessageTime: Date.now(),
      unreadCount: 0
    };
    s.conversations = s.conversations || [];
    s.conversations.unshift(c);
    s.messages[c._id] = s.messages[c._id] || [];
    persist(s);
  }
  return c;
}

function getMessages(convId) {
  const s = ensureState();
  return (s.messages[convId] || []).map((m) => ({
    ...m,
    createTime: formatTime(m.createTime)
  }));
}

function sendChatMessage(convId, peerId, content) {
  const s = ensureState();
  const text = sanitizeText((content || '').trim());
  if (!text) return null;
  const msg = {
    _id: 'm_' + Date.now(),
    senderId: s.me._id,
    content: text,
    createTime: Date.now()
  };
  if (!s.messages[convId]) s.messages[convId] = [];
  s.messages[convId].push(msg);
  const ci = (s.conversations || []).findIndex((c) => c._id === convId);
  if (ci >= 0) {
    s.conversations[ci] = {
      ...s.conversations[ci],
      lastMessage: text,
      lastMessageTime: msg.createTime,
      unreadCount: 0
    };
  }
  persist(s);
  return msg;
}

function markConvRead(convId) {
  const s = ensureState();
  const ci = (s.conversations || []).findIndex((c) => c._id === convId);
  if (ci >= 0) {
    s.conversations[ci] = { ...s.conversations[ci], unreadCount: 0 };
    persist(s);
  }
}

function getSystemNotes() {
  const s = ensureState();
  return (s.systemNotes || [])
    .slice()
    .sort((a, b) => b.createTime - a.createTime)
    .map((n) => ({
      ...n,
      time: timeAgo(n.createTime)
    }));
}

function isFollowing(userId) {
  const s = ensureState();
  s.follows = s.follows || {};
  return !!s.follows[userId];
}

function toggleFollow(userId) {
  const s = ensureState();
  s.follows = s.follows || {};
  s.follows[userId] = !s.follows[userId];
  persist(s);
  return !!s.follows[userId];
}

function followCount() {
  const s = ensureState();
  s.follows = s.follows || {};
  return Object.keys(s.follows).filter((k) => s.follows[k]).length;
}

function matchRecommendations(filters) {
  const s = ensureState();
  const me = s.me;
  const others = listUsersExcept(me._id);
  const gameFilter = filters.game;
  const rankFilter = filters.rank;
  const sameMajor = filters.sameMajor;

  return others
    .map((u) => {
      let score = 60;
      const overlap = (u.games || []).filter((g) => (me.games || []).indexOf(g) >= 0).length;
      score += overlap * 12;
      if (sameMajor && u.grade && me.grade && u.grade === me.grade) score += 8;
      if (gameFilter && (u.games || []).indexOf(gameFilter) >= 0) score += 15;
      if (rankFilter && u.rank === rankFilter) score += 10;
      if (u.authStatus === 'verified') score += 5;
      score = Math.min(99, Math.round(score));
      const gameLabels = (u.games || []).map((gid) => GAME_NAME[gid] || gid);
      const tags = [];
      if (u.voiceEnabled) tags.push('可语音');
      if (overlap > 0) tags.push('常玩重合');
      return {
        _id: u._id,
        _openid: u._id,
        nickname: u.nickname,
        gender: u.gender,
        grade: u.grade || '',
        games: gameLabels,
        matchScore: score,
        tags
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  ME_ID,
  sanitizeText,
  getMe,
  updateMe,
  saveMe,
  getUser,
  getPostsFeed,
  filterPosts,
  getPostById,
  bumpView,
  addPost,
  getComments,
  addComment,
  isLiked,
  toggleLike,
  isCollected,
  toggleCollect,
  deletePost,
  getMyPostIds,
  getCollectedPosts,
  getPostsByUser,
  submitAuth,
  getConversationsForUi,
  getConversationById,
  getOrCreateConversation,
  getMessages,
  sendChatMessage,
  markConvRead,
  getSystemNotes,
  isFollowing,
  toggleFollow,
  followCount,
  matchRecommendations,
  isBlocked,
  toggleBlock
};
