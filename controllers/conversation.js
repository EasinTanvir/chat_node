const conversationModel = require("../models/conversation");
const userModel = require("../models/userSchema");
const HttpError = require("../helper/HttpError");

const createConversation = async (req, res, next) => {
  const { id, userName } = req.body;

  let exisitingUser;

  try {
    exisitingUser = await userModel.findById(req.userData.id);
  } catch (err) {
    const errors = new HttpError("find user failed", 500);
    return next(errors);
  }
  if (exisitingUser.participant.includes(id)) {
    const errors = new HttpError("Sorry conversation already created", 500);
    return next(errors);
  }

  let ownerUser, frndUser;

  try {
    ownerUser = await userModel.findById(req.userData.id);
  } catch (err) {
    const errors = new HttpError("find owner user failed", 500);
    return next(errors);
  }
  try {
    frndUser = await userModel.findById(id);
  } catch (err) {
    const errors = new HttpError("find friend user failed", 500);
    return next(errors);
  }

  ownerUser.participant.push(id);
  frndUser.participant.push(req.userData.id);

  try {
    await ownerUser.save();
  } catch (err) {
    const errors = new HttpError("update owner user failed", 500);
    return next(errors);
  }
  try {
    await frndUser.save();
  } catch (err) {
    const errors = new HttpError("update freind user failed", 500);
    return next(errors);
  }

  const conversation = new conversationModel({
    creator: {
      id: req.userData.id,
      userName: req.userData.userName,
    },
    participant: {
      id: id,
      userName: userName,
    },
  });

  let newCon;

  try {
    newCon = await conversation.save();
  } catch (err) {
    const errors = new HttpError("sorry conversation already created", 500);
    return next(errors);
  }

  res.status(200).json(newCon);
};

const fetchConversation = async (req, res, next) => {
  let myCon;

  try {
    myCon = await conversationModel.find({
      $or: [
        { "participant.id": req.userData.id },
        { "creator.id": req.userData.id },
      ],
    });
  } catch (err) {
    const errors = new HttpError("find conversation failed", 500);
    return next(errors);
  }

  res.status(200).json(myCon);
};

module.exports = {
  createConversation,
  fetchConversation,
};
