const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser } = require('../controllers/users');

userRouter.get('/users/me', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().required().alphanum().length(24),
    }).unknown(true),
  }),
}), getCurrentUser);

module.exports = userRouter;
