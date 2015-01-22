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
		"password email1 email2 name student1 student2"
		).populate("student1 student2")
		.exec(function(err, team) {
			if (err) {
				console.err(err);
			}
			if (team !== null && team.password !== undefined) {
				bcrypt.compare(password, team.password, function(err, correct) {
					if (correct) {
						res.json(genToken(team._id, team.name, team.student1.name, team.student2.name));
						return;
					} else {
						return next(new restify.InvalidCredentialsError ("token is not valid"));
					}
				});
			} else {
				return next(new restify.InvalidCredentialsError ("token is not valid"));
			}
		});
	} else {
		return next(new restify.InvalidCredentialsError ("token is not valid"));
	}
}

function genToken(id, teamName, student1Name, student2Name) {
	var token = jwt.sign({
		id: id
	}, secret(), {
		expiresInMinutes:10000000
	});

	return {
		token: token,
		_id: id,
		teamName:teamName,
		student1: {
			name: student1Name
		},
		student2: {
			name: student2Name
		}
	};
}

module.exports = login;
