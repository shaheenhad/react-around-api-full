const { NODE_ENV, JWT_KEY } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ConflictError } = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch((err) => next(err));
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

  User.findOne({ email })
    .select('+password')
    .then((account) => {
      if (account) {
        return Promise.reject(
          new ConflictError('User with that email already exists'),
        );
      }
      bcrypt.hash(req.body.password, 10).then((hash) => {
        User.create({ name, about, avatar, email, password: hash })
          .then((user) => res.send({ email: user.email }))
          .catch(next);
      });
      return true;
    })
    .catch(next);
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

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, userUpdateOptions)
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, userUpdateOptions)
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => res.send(user))
    .catch((err) => next(err));
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
