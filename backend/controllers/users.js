const { NODE_ENV, JWT_KEY } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const getCurrentUser = (req, res, next) => {
  const currentUserId = req.user._id;
  User.findById(currentUserId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        const e = errorMessage(err, userErr);
        return res.status(e.errStatus).send({ message: e.errMessage });
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_KEY : 'secret_key',
        { expiresIn: '7d' },
      );
      res.status(201).send({
        token,
        user: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
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
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
