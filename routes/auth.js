const authRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { login, register } = require('../controllers/users');

function validateEmail(string, helpers) {
  if (!validator.isEmail(string)) {
    return helpers.error(400, '"email" is not a valid email address');
  }
  return string;
}

authRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  register,
);

authRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

module.exports = authRouter;
