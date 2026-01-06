import Message from "../models/message.model.js";
import { getConversationMessages, createMessage } from "../services/chat.services.js";
import BaseController from "./base.controller.js";

class MessageController extends BaseController {
    constructor() {
        super(Message);
    }

    getByConversation = async (req, res) => {
        try {
            const messages = await getConversationMessages(req.params.id, req.user.id);
            this.success(res, messages);
        } catch (err) {
            this.error(res, err);
        }
    };

    create = async (req, res) => {
        try {
            const { conversation, sender, text, medias } = req.body;
            const message = await createMessage(conversation, sender, text, medias);
            this.success(res, message, 201);
        }
        catch (err) {
            this.error(res, err);
        }
    };
}

export default new MessageController();
