const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const auth = require('./middlewares/auth');
const { register, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', register);
app.post('/signin', login);

app.use(auth);
app.use('/', userRouter);
app.use('/', articleRouter);

app.get('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'An error occured on the server' : message });
});

app.listen(PORT, () => {
  console.log('App is running!');
});
