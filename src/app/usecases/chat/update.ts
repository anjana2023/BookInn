import { ChatDbRepositoryInterace } from "../../interfaces/chatDbInterface";


export const updateUnreadMessages = async (
  conversationID: string,
  recieverID: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => {

  return await chatRepository.updateMessages(
    { conversationId: conversationID, senderId: recieverID },
    { isRead: true }
  );
};
