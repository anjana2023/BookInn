import { Router } from "express";
import chatController from "../../../../adapters/chatController";

import chatDbRepository from "../../../../app/interfaces/chatDbInterface";
import { chatRepositoryMongodb } from "../../../database/repositories/chatRepositoryMongoDB";

const chatRoute = () => {
  const router = Router();
  const _chatController = chatController(
    chatDbRepository,
    chatRepositoryMongodb
  );

  router.post("/conversations", _chatController.createNewChat);
  router.get("/conversations/:senderId", _chatController.fetchChats);
    router.post("/messages", _chatController.createNewMessage);
  router.get("/messages/:conversationId", _chatController.fetchMessages);

  return router;
};
export default chatRoute;