	var
	mongoose = require("mongoose"),
	Schema   = mongoose.Schema,

	UniversitySchema = new Schema({
		name: {
			type: String,
			required: true
		},
		location: {
			lat: {
				type: Number,
				required: true,
				min: -90,
				max: 90
			},
			lon: {
				type: Number,
				required: true,
				min: -180,
				max: 180
			}
		}
	}),

	University = mongoose.model("University", UniversitySchema);

module.exports = University;
