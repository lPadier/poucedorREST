var
	restify = require("restify"),
	key = require("./apiKey")(),
	client = restify.createJsonClient({
		url: "http://www.mapquestapi.com",
		version: "*"
	}),
	urlBase = "/directions/v2/route?key=" + key +
	"&unit=k&routeType=shortest&narrativeType=none";

function getDistance(from, to, callback) {
	url = urlBase + "&from=" + from.lat + "," + from.lon +
		"&to=" + to.lat + "," + to.lon;
	client.get(url, function(err, req, res, obj) {
		callback(obj.route.distance);
	});
}

module.exports = getDistance;
