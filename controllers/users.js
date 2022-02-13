const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/auth-error');
const {
  userNotFound,
  emailTaken,
  userNotCreated,
  invalidCredentials,
} = require('../errors/error-message');
const User = require('../models/user');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(userNotFound))
    .then((user) => {
      if (!user) throw new NotFoundError(userNotFound);
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.register = (req, res, next) => {
  const { name, email, password } = req.body;

  User.exists({ email })
    .then((user) => {
      if (user) throw new ConflictError(emailTaken);
    })
    .catch(next);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      if (!user) throw new NotFoundError(userNotCreated);
      return res.send({
        data: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) next(new UnauthorizedError(invalidCredentials));

      const key = NODE_ENV === 'production' ? JWT_SECRET : 'baf59bf81d780d46135f29b53e34ea58f78d0d920b6e18d8f193c199f69295fe';

      const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};
