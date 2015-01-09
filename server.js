var
	restify    = require("restify"),
	mongoose   = require("mongoose"),
	models     = require("./models"),
	Team       = models.Team,
	University = models.University,
	Student    = models.Student;

var db = mongoose.connect("mongodb://localhost/poucedor");
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

function saveError(err) {
	// TODO do something with the error
}

server.get("api/v1/teams/simple", function(req, res, next) {
	Team.find().populate("university student1 student2").exec(function(err, teams) {
		var filteredTeams = teams.map(function(team) {
			console.log(JSON.stringify(team))
			return {
				name: team.name,
				student1: team.student1,
				student2: team.student2,
				positions: {
					count: team.positions.length,
					last: team.positions.reduce(function(a,b) {
						return a.timestamp>b.timestamp ? a : b;
					}),
					furthest: team.positions.reduce(function(a,b) {
						return a.distance > b.distance ? a : b;
					})
				}
			}
		});
		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		res.end(JSON.stringify(filteredTeams));
	})
});

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

server.listen(3000, function() {
	console.log("server started @ 3000");
});
