const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  let cardOwner;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      cardOwner = card.owner.toString();
      if (req.user._id === cardOwner) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail()
          .then(() => res.send({ message: 'Card deleted' }));
        return;
      }
      throw new ForbiddenError("Cannot delete another user's cards");
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('No card found with that id');
    })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('No card found with that id');
    })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
