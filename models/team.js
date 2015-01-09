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
		student1: {
			type: Schema.Types.ObjectId,
			ref: "Student"
		},
		student2: {
			type: Schema.Types.ObjectId,
			ref: "Student"
		},
		positions: [ Position.schema ],
		university: {
			type: Schema.Types.ObjectId,
			ref: "University"
		}
	}),

	Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
