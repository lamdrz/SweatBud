import Message from "../models/message.model.js";
import { getConversationMessages } from "../services/chat.services.js";
import BaseController from "./base.controller.js";

class MessageController extends BaseController {
    constructor() {
        super(Message);
    }

    getByConversation = async (req, res) => {
        try {
            const messages = await getConversationMessages(req.params.id);
            this.success(res, messages);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new MessageController();
