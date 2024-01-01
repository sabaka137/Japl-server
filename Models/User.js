const { Schema, model } = require('mongoose');

const User = new Schema({
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String },
  surname: { type: String },
  email: { type: String },
  country: { type: Object },
  photo: { type: String },
  lessons: [{ type: Object }],
  notifications: [{ type: Object }],
  languages: [{ type: Object }],
  favoriteTeachers: [],
  certificates: [{ type: Object }],
  education: { type: Object },
  description: { type: Object },
  schedule: [{ type: Object }],
  price: { type: String },
  groups: [{ type: Object, ref: 'Groups' }],
});

module.exports = model('User', User);
