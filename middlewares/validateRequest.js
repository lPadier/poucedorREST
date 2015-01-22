var
	jwt     = require("jsonwebtoken"),
	secret  = require("../config/secret"),
	restify = require("restify");

function validateRequest(req, res, next) {
	var token = req.headers["x-access-token"];

	jwt.verify(token, secret(), function(err, decoded) {
		if (err) {
			return next(new restify.InvalidCredentialsError ("token is not valid"));
		}
		req._id = decoded.id;
		console.log("reqID",req._id)
		next();
	});
}

module.exports = validateRequest;
