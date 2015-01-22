var
	mongoose   = require("mongoose"),
	Student    = require("./student"),
	University = require("./university"),
	Position   = require("./position"),
	Schema     = mongoose.Schema,

	TeamSchema = new Schema({
		name: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		student1: {
			type: Schema.Types.ObjectId,
			ref: "Student",
			required: true
		},
		student2: {
			type: Schema.Types.ObjectId,
			ref: "Student",
			required: true
		},
		email1: {
			type: String,
			required: true,
			select: false
		},
		email2: {
			type: String,
			required: true,
			select: false
		},
		positions: [ Position.schema ],
		university: {
			type: Schema.Types.ObjectId,
			ref: "University"
		}
	}),

	Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
