const _result = function(error, result) {
	this.error = error;
	this.result = result;
};

_result.prototype.getError = function() {
	return this.error;
}

_result.prototype.getResult = function() {
	return this.result;
}

const _promise = {};

_promise.create = function(mission, executor, ...params) {
	params = params || [];
	return new Promise(
		(resolve, reject) => {
			let operator = (error, result) => {
				let feedback = new _result(error, result);
				return resolve(feedback);
			}
			params.push(operator);
			return mission.apply(executor, params);
		}
	);
};

module.exports = _promise;