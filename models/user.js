const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../errors/auth-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 8,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new AuthenticationError('Incorrect email or password.'));

      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) return Promise.reject(new AuthenticationError('Incorrect email or password'));

          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
