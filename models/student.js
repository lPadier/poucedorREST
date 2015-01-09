var
	mongoose = require("mongoose"),
	Schema   = mongoose.Schema,

	StudentSchema = new Schema({
		name: {
			first: {
				type: String,
				required: true
			},
			middle: {
				type: String
			},
			last: {
				type: String,
				required: true
			}
		},
		email: {
			type: String,
			required: true
		}
	}),

	Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
