/** 游戏与展示文案 */
const GAME_LIST = [
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
];

const GAME_NAME = GAME_LIST.reduce((acc, g) => {
  acc[g.id] = g.name;
  return acc;
}, {});

const FILTER_TAGS = ['可语音', '佛系上分', '娱乐唠嗑', '新手带飞', '上分冲段', '夜间玩家'];

/** 简单敏感词（演示用，可接云函数/第三方审核） */
const SENSITIVE_WORDS = ['微信', '加我', '二维码', '代练', '外挂', '赌博', '色情'];

module.exports = {
  GAME_LIST,
  GAME_NAME,
  FILTER_TAGS,
  SENSITIVE_WORDS
};
