const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const loggedOutUsersSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
    }
  }
});

//verify JWT
loggedOutUsersSchema.statics.findByToken = function(token) {
  const payload = jwt.verify(token, process.env.APP_SECRET);

  return this
    .findOne({ email: payload.email });
};

module.exports = mongoose.model('User', loggedOutUsersSchema);