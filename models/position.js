var
	mongoose = require("mongoose"),
	Schema   = mongoose.Schema,

	PositionSchema = new Schema({
		timestamp: {
			type: Number,
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
		},
		distance: {
			type: Number
		}
	});

	Position = mongoose.model("Position", PositionSchema);

module.exports = Position;
