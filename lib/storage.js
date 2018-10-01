/* CLASS STORAGE */
const Storage = function(name) {
	this._name = name || "Unnamed";
	this._data = {};
};

Storage.prototype.set = function(path, value) {
	if (!path) return false;
	return this._data[path] = value;
}

Storage.prototype.get = function(path) {
	if (!path) return false;
	return this._data[path];
}

Storage.prototype.data = function() {
	return this._data;
}

Storage.prototype.clear = function(path) {
	if (!path) return this._data = {};
	// same as storage.set(path, null);
	return this._data[path] = null;
}

module.exports = Storage;