# nodelib
it's raining *o*

## logger
	const Logger = require("./lib/logger.js");
	const logger = new Logger("path", "filename", ".fileextension");

	logger.info("wow");
	logger.warning("wow");
	logger.debug("wow");
	logger.in("wow");
	logger.out("wow");
	logger.error("wow");
	logger.fail("wow");
	logger.success("wow");

## server
	const Server = require("./lib/server.js");
	const server = new Server("host", "port");

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

## promise

	const promise = require("./lib/promise.js");

	const object = {
		setDelayedValue(key, value, delay, callback) {
			if (key == null || value == null || !delay) return callback(true, null);
			return setTimeout(
				() => {
					this[key] = value;
					callback(null, this[key]);
				}
			, delay);
		}
	}

	async function main() {
		let value = await promise.create(object.setDelayedValue, object, "x", 11, 600);
		console.log(value);
	}

	main();

## storage
	const Storage = require("./lib/storage.js");
	const storage = new Storage();

	storage.set("name", "billy");

	let name = storage.get("name");
	console.log(name);

	name = storage.set("name", null);
	console.log(name);

	console.log(storage.data());

	storage.clear();
	console.log(storage.data());