const Message = require("../models/Message");

const messageController = {
    createMessage: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const { chatId, senderId, text } = req.body;

            const message = new Message({
                chatId,
                senderId,
                text,
            });

            const result = await message.save();
            if (result) {
                status = 200;
                data = {
                    success: true,
                    message: result,
                };
            } else {
                status = 404;
                data = {
                    success: false,
                    message: "Message data failed",
                };
            }
        } catch (error) {
            console.log(error);
            data = error;
        }
        res.status(status).json(data);
    },

    getMessage: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const { chatId } = req.params;
            if (chatId) {
                const message = await Message.find({ chatId })
                if (message) {
                    status = 200;
                    data = {
                        success: true,
                        message: message,
                    };
                } else {
                    status = 404;
                    data = {
                        success: false,
                        message: "Chat data failed",
                    };
                }
            }
            else {
                status = 403;
                data = {
                    success: false,
                    message: "No id found or incorrect id",
                };
            }

        } catch (error) {
            data = error;
        }
        res.status(status).json(data);
    },

    deleteMessage: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const { id } = req.params;
            if (!id) {
                status = 403;
                data = {
                    success: false,
                    message: "No id found or incorrect id",
                };
            }
            else {
                const message = await Message.findByIdAndDelete(id);
                console.log(message);
                if (message) {
                    status = 200;
                    data = {
                        success: true,
                        message: "Delete successfully",
                    };
                } else {
                    status = 404;
                    data = {
                        success: false,
                        message: "Chat data failed",
                    };
                }
            }

        } catch (error) {
            console.log(error);
            data = error;
        }
        res.status(status).json(data);
    },

}

module.exports = messageController;