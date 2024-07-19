import { ChatDbRepositoryInterace } from "../../interfaces/chatDbInterface";

export const getChats = async (
  senderId: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => await chatRepository.getAllConversations(senderId);

export const getChatById = async (
  id: string,
  userId: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => {
  // await chatRepository.updateMessages(
  //   { conversationId: id, senderId: { $ne: userId } },
  //   { isRead: true }
  // );
  return await chatRepository.getConversationById(id);
};

export const getMessages = async (
  conversationID: string,

  chatRepository: ReturnType<ChatDbRepositoryInterace>
) =>
  await chatRepository.getPaginatedMessage(
       conversationID
  );

export const getLatestMessages = async (
  recieverId: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>,
  conversationID?: string
) => {
  const filter: Record<string, any> = {
    senderId: recieverId,
    isRead: false,
  };
  conversationID && (filter.conversationId = conversationID);
  const messages = await chatRepository.getLatestMessage(filter);
  return messages;
};
