const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');
const validator = require('validator');
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { register, login } = require('./controllers/users');

require('dotenv').config();

function validateEmail(string, helpers) {
  if (!validator.isEmail(string)) {
    return helpers.error(400, '"email" is not a valid email address');
  }
  return string;
}

mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().min(8).required(),
  }),
}), register);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.use(auth);
app.use('/', userRouter);
app.use('/', articleRouter);

app.get('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Requested resource not found' });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'An error occured on the server' : message });
});

app.listen(PORT, () => {

});
