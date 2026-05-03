function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatTime(d) {
  const date = d instanceof Date ? d : new Date(d);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function timeAgo(d) {
  const date = d instanceof Date ? d : new Date(d);
  const diff = Date.now() - date.getTime();
  if (diff < 60 * 1000) return '刚刚';
  if (diff < 60 * 60 * 1000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 48 * 60 * 60 * 1000) return '昨天';
  return Math.floor(diff / (24 * 3600000)) + '天前';
}

module.exports = {
  formatTime,
  timeAgo
};
