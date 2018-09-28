const promise = require("./lib/promise.js");

const Logger = require("./lib/logger.js");
const logger = new Logger("./logs/", "log", ".txt");

const Server = require("./lib/server.js");
const server = new Server("localhost", 5000);

server.route("post", "/",
	(request, response) => {
		let body = request.body;
		logger.in("Requesting / body", body);

		return response.sendStatus(200);
	}
);

server.run(
	(host, port) => {
		return logger.info("Server is running on " + host + ":" + port);
	}
);

