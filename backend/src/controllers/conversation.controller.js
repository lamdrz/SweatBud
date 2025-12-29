import Conversation from "../models/conversation.model.js";
import BaseController from "./base.controller.js";
import { getInbox,  getConversationDetails } from "../services/chat.services.js";

class ConversationController extends BaseController {
    constructor() {
        super(Conversation);
    }

    getInbox = async (req, res) => {
        try {
            const inbox = await getInbox(req.user.id, req.query.type ?? null);
            this.success(res, inbox);
        } catch (err) {
            this.error(res, err);
        }
    };

    getById = async (req, res) => {
        try {
            const conversation = await getConversationDetails(req.params.id);
            this.success(res, conversation);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new ConversationController();
