const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const articleRouter = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

function createUrlValidator(errorMessage) {
  return function validateUrl(string, helpers) {
    if (!validator.isURL(string)) {
      return helpers.error(400, errorMessage);
    }
    return string;
  };
}

const validateImageUrl = createUrlValidator('"image" is not a valid URL');
const validateLinkUrl = createUrlValidator('"link" is not a valid URL');

articleRouter.get(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      user: Joi.object()
        .keys({
          _id: Joi.string().required().hex().length(24),
        })
        .unknown(true),
    }),
  }),
  getArticles,
);

articleRouter.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateLinkUrl),
      image: Joi.string().required().custom(validateImageUrl),
      user: Joi.object().keys({
        _id: Joi.string().required().hex().length(24),
      }),
    }),
  }),
  createArticle,
);

articleRouter.delete(
  '/articles/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().required().hex().length(24),
    }),
    body: Joi.object().keys({
      user: Joi.object()
        .keys({
          _id: Joi.string().required().hex().length(24),
        })
        .unknown(true),
    }),
  }),
  deleteArticle,
);

module.exports = articleRouter;
