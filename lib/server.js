const express = require("express");
const helmet = require("helmet");
const body_parser = require("body-parser");

const Server = function(host, port) {
	if (!port) throw new Error("Missing params on Server::Constructor.");
	host = host || "localhost";

	this._host = host;
	this._port = port;

	this._server = _createServer(this._host, this._port);
	if (!this._server) return new Error("Can't create Server on Server::Constructor.");
};

Server.prototype.route = function(protocol, route, callback) {
	if (!(protocol && route && callback)) return false; 

	switch (protocol) {
		case "post":
			this._server.post(route, callback);
		case "get":
			this._server.get(route, callback);
		default:
			return false;
	}

	return true;
}

Server.prototype.run = function(callback) {
	callback = callback || (() => {});
	let operator = () => {
		return callback(this._host, this._port);
	}
	return this._server.listen(this._port, operator);
}

// static functions
const _createServer = function(host, port) {
	if (!(host && port)) return false;

	let server = express();

	// setting plug-ins
	server.use(body_parser.urlencoded({extended : true}));
	server.use(body_parser.json());
	server.use(helmet());

	return server;
}

module.exports = Server;