var
	mongoose = require("mongoose"),
	Schema   = mongoose.Schema,

	StudentSchema = new Schema({
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			select: false
		}
	}),

	Student = mongoose.model("Student", StudentSchema);

	StudentSchema.path("email").validate(function(value, done) {
		this.model("Student").count({ email: value }, function(err, count) {
			if (err) {
				return done(err);
			}
			// If `count` is greater than zero, "invalidate"
			done(!count);
		});
	}, "Email already exists");

module.exports = Student;
