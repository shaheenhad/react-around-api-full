const Card = require('../models/card');
const { badReqErr, notFoundErr, intServErr } = require('../utils/constants');
const { errorMessage } = require('../utils/errorMessage');

const cardErr = 'Card';

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      const e = errorMessage(err, cardErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const e = errorMessage(err, cardErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = notFoundErr;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const e = errorMessage(err, cardErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = notFoundErr;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const e = errorMessage(err, cardErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = notFoundErr;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const e = errorMessage(err, cardErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
