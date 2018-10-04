const mysql = require("mysql");

const Database = function(host, user, password, database) {
	if (!(host && user && password && database)) throw new Error("Missing params on Database:Constructor.");
	
	this._connection = mysql.createConnection(
		{host, user, password, database}
	);

	this._connected = false;
};

Database.prototype.connect = function(callback) {
	if (this._connected) return callback(null, true);

	return this._connection.connect(
		(error, result) => {
			if (error) return callback(error, null);
			this._connected = true;
			return callback(null, true);
		}
	);
}

Database.prototype.set = function(table, values, callback) {
	if (!(table && values)) return callback("Missing table or values on Database::set", null);

	return this.connect(
		(error, result) => {
			if (error) return callback(error, null);

			const query = _createSetQuery(table, values);
			if (!query) return callback("Can't make query on Database::set", null);
			console.log(query);

			return this._connection.query(
				query,
				(error, result, fields) => {
					console.log(error, result, fields);
				}
			);
		}
	);
}

Database.prototype.get = function(table, conditions, callback) {
	if (!(table && values)) return callback("Missing table or values on Database::get", null);

	return this.connect(
		(error, result) => {
			if (error) return callback(error, null);

			const query = _createGetQuery(table, conditions);
			if (!query) return callback("Can't make query on Database::get", null);
			console.log(query);

			return this._connection.query(
				query,
				(error, result, fields) => {
					console.log(error, result, fields);
				}
			);
		}
	);
}


/* STATIC FUNCTIONS */

const _createSetQuery = function(table, values) {
	if (!(table && values)) return false;

	let query = "";
	let insert = "INSERT INTO " + table + " ";

	let where = "";
	if (conditions && conditions.length && conditions.length % 2 == 0) {
		where += " WHERE ";
		for (let i = 0; i < conditions.length; i++) {
			where += conditions[i] + " = ";
			i++;
			where += conditions[i] + " ";
		}

		where = where.substring(0, where.length - 1);
	}

	query += insert + where;
	query += ";";

	return query;
}

module.exports = Database;