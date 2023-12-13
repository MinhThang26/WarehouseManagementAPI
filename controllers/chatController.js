const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Owner = require("../models/Owner");
const User = require("../models/User");

const chatController = {
    createChat: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const { firstId, secondId } = req.body;
            if (firstId == null || firstId == "" || secondId == "" || secondId == null) {
                status = 400;
                data = {
                    success: false,
                    message: "Create chat failed due to lack content",
                };
            } else {
                const chat = await Chat.findOne({
                    members: { $all: [firstId, secondId] },
                });
                if (chat) {
                    status = 200;
                    data = {
                        success: true,
                        chat: chat,
                    };
                }
                const newChat = new Chat({
                    members: [firstId, secondId],
                })
                const result = await newChat.save();
                if (result) {
                    status = 200;
                    data = {
                        success: true,
                        chat: result,
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

    userChats: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const userId = req.params.userId;
            if (userId) {
                const chat = await Chat.find({
                    members: { $in: [userId] },
                });
                if (chat) {
                    status = 200;
                    data = {
                        success: true,
                        chat: chat,
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

    findChat: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const { firstId, secondId } = req.params;
            if (firstId && secondId) {
                const chat = await Chat.findOne({
                    members: { $all: [firstId, secondId] },
                });
                if (chat) {
                    status = 200;
                    data = {
                        success: true,
                        chat: chat,
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

    getListChat: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const chat = await Chat.find();
            if (chat) {
                status = 200;
                data = {
                    success: true,
                    chat: chat,
                };
            } else {
                status = 404;
                data = {
                    success: false,
                    message: "Chat data failed",
                };
            }
        } catch (error) {
            data = error;
        }
        res.status(status).json(data);
    },

    getProfileUser: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const profileUser = await User.findOne({
                $or: [
                    { _id: req.params.id }
                ]
            });
            if (profileUser) {
                status = 200;
                data = {
                    success: true,
                    User: profileUser,
                };
            } else {
                status = 404;
                data = {
                    success: false,
                    message: "Chat data failed",
                };
            }
        } catch (error) {
            data = error;
        }
        res.status(status).json(data);
    },
    getProfileOwner: async (req, res) => {
        let status = 500;
        let data = null;
        try {
            const profileOwner = await Owner.findOne({
                $or: [
                    { _id: req.params.id }
                ]
            });
            if (profileOwner) {
                status = 200;
                data = {
                    success: true,
                    Owner: profileOwner,
                };
            } else {
                status = 404;
                data = {
                    success: false,
                    message: "Chat data failed",
                };
            }
        } catch (error) {
            data = error;
        }
        res.status(status).json(data);
    },

    deleteChat: async (req, res) => {
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
                const chat = await Chat.findByIdAndDelete(id);
                const chat2 = await Message.findOne({ chatId: id });
                if (chat2 || chat2 === "null") {
                    await chat2.delete();
                    console.log(chat2);
                }
                if (chat && chat2) {
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

module.exports = chatController;