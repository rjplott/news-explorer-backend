const NotFoundError = require('../errors/not-found');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.create({ name, email, password })
    .then((user) => {
      if (!user) throw new NotFoundError('Requested resource was not located.');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.body._idd)
    .orFail(new NotFoundError('No user was found'))
    .then((user) => {
      if (!user) throw new NotFoundError('No user was found.');
      return res.status(200).send({ data: user });
    })
    .catch(next);
};
