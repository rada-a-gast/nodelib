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