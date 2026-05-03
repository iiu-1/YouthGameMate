const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    switch (action) {
      case 'createConversation':
        return await createConversation(data);
      case 'sendMessage':
        return await sendMessage(data);
      case 'getConversations':
        return await getConversations(data);
      case 'getMessages':
        return await getMessages(data);
      default:
        return { success: false, error: '未知操作' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

async function createConversation(data) {
  const { participants } = data;
  
  const existing = await db.collection('conversations')
    .where({
      participants: _.all(participants)
    })
    .get();
  
  if (existing.data.length > 0) {
    return { success: true, convId: existing.data[0]._id };
  }
  
  const result = await db.collection('conversations').add({
    data: {
      participants: participants,
      lastMessage: '',
      lastMessageTime: new Date(),
      createTime: new Date()
    }
  });
  
  return { success: true, convId: result._id };
}

async function sendMessage(data) {
  const { convId, senderId, receiverId, content, type = 'text' } = data;
  
  const message = await db.collection('messages').add({
    data: {
      convId: convId,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      type: type,
      createTime: new Date()
    }
  });
  
  await db.collection('conversations').doc(convId).update({
    data: {
      lastMessage: content,
      lastMessageTime: new Date()
    }
  });
  
  return { success: true, messageId: message._id };
}

async function getConversations(data) {
  const { userId } = data;
  
  const conversations = await db.collection('conversations')
    .where({
      participants: userId
    })
    .orderBy('lastMessageTime', 'desc')
    .limit(50)
    .get();
  
  return { success: true, data: conversations.data };
}

async function getMessages(data) {
  const { convId, limit = 50 } = data;
  
  const messages = await db.collection('messages')
    .where({ convId: convId })
    .orderBy('createTime', 'asc')
    .limit(limit)
    .get();
  
  return { success: true, data: messages.data };
}