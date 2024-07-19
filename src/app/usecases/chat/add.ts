import { newMessageInterface } from "../../../types/chat";
import { ChatDbRepositoryInterace } from "../../interfaces/chatDbInterface";

export const getConverationByMembers=async(
  senderId:string,
  recieverId:string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
)=>await chatRepository.isChatExists(senderId, recieverId)

export const newMessage = async (
  newMessageData: newMessageInterface,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => await chatRepository.addNewMessage(newMessageData);

export const addNewChat = async (
  senderId: string,
  recieverId: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => {
  const isChatExist = await chatRepository.isChatExists(senderId, recieverId)
  if (isChatExist) return isChatExist
  return await chatRepository.createNewChat([senderId, recieverId])
}
