const conversationModel = require("../models/conversation");
const messageModel = require("../models/message");
const userModel = require("../models/userSchema");
const HttpError = require("../helper/HttpError");

const createMessage = async (req, res, next) => {
  const { conId, userName, text, id } = req.body;
  const createMessage = new messageModel({
    conversationId: conId,
    sender: {
      id: req.userData.id,
      userName: req.userData.userName,
    },
    receiver: {
      id: id,
      userName: userName,
    },
    text: text,
  });

  let newuser;
  try {
    newuser = await createMessage.save();
  } catch (err) {
    const errors = new HttpError("create message failed", 500);
    return next(errors);
  }
  const io = req.app.get("name");
  io.emit("message", {
    action: "create",
    message: newuser,
  });

  res.status(200).json(newuser);
};

const fetchMessage = async (req, res, next) => {
  let fetchMsg;
  try {
    fetchMsg = await messageModel.find({ conversationId: req.params.id });
  } catch (err) {
    const errors = new HttpError("create message failed", 500);
    return next(errors);
  }

  const { participant, creator } = await conversationModel.findById(
    req.params.id
  );

  res.status(200).json({ fetchMsg, participant, creator });
};

module.exports = {
  createMessage,
  fetchMessage,
};
