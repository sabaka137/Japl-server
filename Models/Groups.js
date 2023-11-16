const { Schema, model, default: mongoose } = require("mongoose");

const Groups = new mongoose.Schema({

	name: { type: String, required: true },
	description: { type: String},
	termins: { type: Array, required: true, ref:'GroupTerm' },
});


const GroupTerm = new Schema([{
	termin: { type: String, required: true },
	meaning: { type: String, required:true},
	reading: { type: String },
}]);

module.exports = model('GroupTerm',GroupTerm)
module.exports = model('Groups',Groups)