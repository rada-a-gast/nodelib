const Database = require("./lib/database.js");
const database = new Database("FDPSVR117", "flexbot", "iopeople2018", "flexbotsdb");

let k = database.set(
	"testing",
	{
		id : 1,
		name : "retardado",
		value : 10
	},
	(e, r) => {
		console.log(e, r)
	}
);

console.log(k)