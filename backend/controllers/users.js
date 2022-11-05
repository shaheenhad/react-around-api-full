const User = require('../models/user');
const { notFoundErr } = require('../utils/constants');
const { errorMessage } = require('../utils/errorMessage');

const userErr = 'User';

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const e = errorMessage(err);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('DocumentNotFoundError');
      error.statusCode = notFoundErr;
      throw error;
    })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      const e = errorMessage(err, userErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const e = errorMessage(err, userErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const userUpdateOptions = {
  new: true, // the then handler receives the updated entry as input
  runValidators: true, // the data will be validated before the update
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, userUpdateOptions)
    .orFail(() => {
      const error = new Error('User not found');
      error.statusCode = notFoundErr;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const e = errorMessage(err, userErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, userUpdateOptions)
    .orFail(() => {
      const error = new Error('User not found');
      error.statusCode = notFoundErr;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const e = errorMessage(err, userErr);
      return res.status(e.errStatus).send({ message: e.errMessage });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
