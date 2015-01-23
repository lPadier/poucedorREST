var
	bcrypt     = require("bcrypt"),
	restify    = require("restify"),
	models     = require("./models"),
	distance   = require("./distance"),
	Team       = models.Team,
	Position   = models.Position,
	Student    = models.Student,
	University = models.University;

function findAllTeamsSimple(req, res, next) {
	Team.find().populate("university student1 student2").exec(function(err, teams) {
		var filteredTeams = teams.filter(function(team) {
			return team._id != req._id;
		}).map(function(team) {
			return {
				id: team._id,
				name: team.name,
				student1: team.student1,
				student2: team.student2,
				university: team.university,
				positions: {
					count: team.positions.length,
					last: team.positions.reduce(function(a, b) {
						return a.timestamp > b.timestamp ? a : b;
					}, {}),
					furthest: team.positions.reduce(function(a, b) {
						return a.distance > b.distance ? a : b;
					}, {})
				}
			};
		});
		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		res.end(JSON.stringify(filteredTeams));
	});
}

function findAllTeams(req, res, next) {
	Team.find().populate("university student1 student2").exec(function(err, teams) {
		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		res.end(JSON.stringify(teams));
	});
	return next();
}

function addPositionToTeam(req, res, next) {
	if (req._id === req.params.id) {

		Team.findById(req.params.id).populate("university").exec(function(err, team) {
			distance(team.university.location, req.params.location, function(dist) {
				var position = new Position();
				position.timestamp = req.params.timestamp;
				position.location = req.params.location;
				position.distance = dist;
				position.save(
					console.error
				);
				team.positions.push(position);
				team.save(
					console.error
				);
				res.send(team);
			});
		});
	} else {
		return next(new restify.UnauthorizedError("Cannot add position to other team"));
	}

}

function createTeam(req, res, next) {
	var student1 = new Student();
	student1.name = req.params.student1.name;
	student1.email = req.params.student1.email;
	student1.save(function(error) {
		if (error) {
			return next(new restify.InvalidContentError (error.message));
		} else {
			var student2 = new Student();
			student2.name = req.params.student2.name;
			student2.email = req.params.student2.email;
			student2.save(function(error) {
				if (error) {
					return next(new restify.InvalidContentError (error.message));
				} else {
					var team        = new Team();
					team.name       = req.params.name;
					team.location   = req.params.location;
					team.university = req.params.university;
					team.student1   = student1._id;
					team.student2   = student2._id;
					team.email1     = student1.email;
					team.email2     = student2.email;
					bcrypt.genSalt(10, function(err, salt) {
						if (error) {
							return next(new restify.InternalServerError("Something went wrong"));
						} else {
							bcrypt.hash(req.params.password, salt, function(err, hash) {
								if (error) {
									return next(new restify.InternalServerError("Something went wrong"));
								} else {
									team.password = hash;
									team.save(
										function(error) {
											if (error) {
												return next(new restify.InvalidContentError (error.message));
											} else {
												res.send(team);
											}
										}
									);
								}
							});
						}
					});
				}
			});
		}
	});
}

function createUniversity(req, res, next) {
	var university = new University();
	university.name = req.params.name;
	university.location = req.params.location;
	university.save(function(error) {
		if (error) {
			return next(new restify.InvalidContentError (error.message));
		} else {
			res.send(university);
		}
	});
}

function getUniversities(req, res, next) {
	University.find({}, function(err, universities) {
		if (error) {
			return next(error);
		} else {
			res.json(universities);
		}
	});
}

module.exports = {
	findAllTeamsSimple: findAllTeamsSimple,
	findAllTeams: findAllTeams,
	addPositionToTeam: addPositionToTeam,
	createTeam: createTeam,
	createUniversity: createUniversity
};
