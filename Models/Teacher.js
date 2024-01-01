const { Schema, model } = require('mongoose');

const Teacher = new Schema({
  name: { type: String },
  password: { type: String, required: true },
  title: { type: String },
  knowledge: { type: String },
  experience: { type: String },
  lessonCost: { type: String },
  groups: [{ type: Object, ref: 'Groups' }],
});

module.exports = model('Teacher', Teacher);
