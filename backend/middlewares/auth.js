const { NODE_ENV, JWT_KEY } = process.env;
const jwt = require('jsonwebtoken');
const LoginError = require('../errors/LoginError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new LoginError('Authorization Required');
    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_KEY : 'secret_key',
    );
  } catch (err) {
    const err2 = new LoginError('Authorization Verification Failure');
    next(err2);
  }

  req.user = payload;
  next();
};
