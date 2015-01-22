var
	port       = process.env.port || 8080,
	restify    = require("restify"),
	mongoose   = require("mongoose"),
	models     = require("./models"),
	login      = require("./login"),
	valid      = require("./middlewares/validateRequest"),
	methods    = require("./methods"),
	Team       = models.Team,
	University = models.University,
	Student    = models.Student,

	db = mongoose.connect("mongodb://localhost/poucedor"),

	server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

function saveError(err) {
	console.error(err);
}

server.post("api/v1/login", login);
server.get( "api/v1/teams/simple",         valid, methods.findAllTeamsSimple);
server.get( "/api/v1/teams",               valid, methods.findAllTeams);
server.post("/api/v1/teams/:id/positions", valid, methods.addPositionToTeam);
server.post("/api/v1/teams",               methods.createTeam);
server.post("/api/v1/universities",        methods.createUniversity);

server.listen(port, function() {
	console.log("server started @ " + port);
});
