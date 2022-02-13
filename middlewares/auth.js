const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/auth-error');
const { authorizationRequired } = require('../errors/error-message');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError(authorizationRequired);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'baf59bf81d780d46135f29b53e34ea58f78d0d920b6e18d8f193c199f69295fe');
  } catch (e) {
    const err = new AuthenticationError(authorizationRequired);
    next(err);
  }

  req.user = payload;

  return next();
};
