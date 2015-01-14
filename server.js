var
	restify    = require("restify"),
	mongoose   = require("mongoose"),
	models     = require("./models"),
	login      = require("./login"),
	valid      = require("./middlewares/validateRequest"),
	teams      = require("./teams"),
	Team       = models.Team,
	University = models.University,
	Student    = models.Student,

	db = mongoose.connect("mongodb://localhost/poucedor"),

	server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

function saveError(err) {
	// TODO do something with the error
}

// server.get("api/v1/teams/login", login);

server.get("api/v1/teams/simple", valid, teams.findAllTeams);

server.get("/api/v1/teams", function(req, res, next) {
	Team.find().populate("university student1 student2").exec(function(err, teams) {
		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		res.end(JSON.stringify(teams));
	});
	return next();
});

server.post("/api/v1/teams", function(req, res, next) {
	var team        = new Team();
	team.name       = req.params.name;
	team.location   = req.params.location;
	team.university = req.params.university;
	team.student1   = req.params.student1;
	team.student2   = req.params.student2;
	team.save(
		saveError
	);
	res.send(team);
});

server.post("/api/v1/teams/:id/positions", function(req, res, next) {
	var position = new Position();
	position.timestamp = req.params.timestamp;
	position.location = req.params.location;
	position.distance = req.params.distance;
	position.save(
		saveError
	);
	Team.findById(req.params.id, function (err, team) {
		team.positions.push(position);
		team.save(
			saveError
		);
		res.send(team);
	});
})

var port = 4500;

server.listen(4500, function() {
	console.log("server started @ 4500");
});
