var
	restify = require("restify"),
	bcrypt  = require("bcrypt"),
	jwt     = require("jsonwebtoken"),
	Team    = require("./models").Team,
	secret  = require("./config/secret");

function login(req, res, next) {
	var
		username = req.body.username || "",
		password = req.body.password || "";

	if (username !== "" && password !== "") {
		Team.findOne({
			$or: [
				{ "email1": username },
				{ "email2": username }
			]
		},
		"password email1 email2",
		function(err, team) {
			if (err) {
				console.err(err);
			}
			console.log(team.password);
			if (team !== null && team.password !== undefined) {
				bcrypt.compare(password, team.password, function(err, correct) {
					if (correct) {
						res.json(genToken(team._id));
						return;
					} else {
						return next(new restify.InvalidCredentialsError ("token is not valid"));
					}
				});
			} else {
				return next(new restify.InvalidCredentialsError ("token is not valid"));
			}
		});
	}
}

function genToken(id) {
	var token = jwt.sign({
		id: id
	}, secret(), {
		expiresInMinutes:10000000
	});

	return {
		token: token,
		_id: id
	};
}

module.exports = login;
