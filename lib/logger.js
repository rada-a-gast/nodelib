const fs = require("fs");
const moment = require("moment");

const COLORS = {
    reset : "\x1b[0m", bright : "\x1b[1m", dim : "\x1b[2m", underscore : "\x1b[4m",
    blink : "\x1b[5m", reverse : "\x1b[7m", hidden : "\x1b[8m",

    fgblack : "\x1b[30m", fgred : "\x1b[31m", fggreen : "\x1b[32m", fgyellow : "\x1b[33m",
    fgblue : "\x1b[34m", fgmagenta : "\x1b[35m", fgcyan : "\x1b[36m", fgwhite : "\x1b[37m",

    bgblack : "\x1b[40m", bgred : "\x1b[41m", bggreen : "\x1b[42m", bgyellow : "\x1b[43m",
    bgblue : "\x1b[44m", bgmagenta : "\x1b[45m", bgcyan : "\x1b[46m", bgwhite : "\x1b[47m"
};

const LOGTYPES = {
	info : {symbol : "^", color : COLORS.fgwhite},
	warning : {symbol : "!", color : COLORS.fgyellow},
	debug : {symbol : "$", color : COLORS.fgred},
	in : {symbol : ">", color : COLORS.fgcyan},
	out : {symbol : "<", color : COLORS.fgmagenta},
	error : {symbol : "*", color : COLORS.fgred},
	fail : {symbol : "-", color : COLORS.fgred},
	success : {symbol : "+", color : COLORS.fggreen}
};

const Logger = function(path = "./", file = "default", extension = ".txt") {
	this._path = path;
	this._file = file;
	this._extension = extension;

	// create file string
	let timestamp = moment().format("YYYY-MM-DD");
	this._file = this._path + this._file + timestamp + this._extension;

	// create writable stream
	this._stream = _createStream(this._file);
	if (!this._stream) throw new Error("Can't create WritableStream on Logger::Constructor.");
};

Logger.prototype.getStream = function() {
	return this._stream || false;
}

Logger.prototype.setStream = function(stream) {
	return this._stream = stream;
}

Logger.prototype.closeStream = function() {
	if (!this._stream) return false;
	return this._stream.close();
}

// static functions
const _createStream = function(file_path) {
	let stream = fs.createWriteStream(file_path);
	return stream;
}

// static instruction
for (let k in LOGTYPES) {
	let type = LOGTYPES[k];

	Logger.prototype[k] = function(message, ...params) {
		let now = moment();
		let time = now.format("YYYY-MM-DD HH-mm-SS");

		let console_log = type.color + "[" + type.symbol + "] " + message + "." + COLORS.reset;
		console.log(console_log);

		for (let k in params) {
			console.log(params[k]);
		}

		let stream = this.getStream();
		let file_log = time + " -> " + "[" + type.symbol + "] " + message + "." + "\r\n";
		return stream.write(file_log);
	}
}

module.exports = Logger;