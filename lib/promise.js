const Result = function(error, result) {
	this.error = error;
	this.result = result;
};

Result.prototype.getError = function() {
	return this.error;
}

Result.prototype.getResult = function() {
	return this.result;
}

const PromiseHandler = {};

PromiseHandler.create = function(mission, executor, ...params) {
	params = params || [];
	return new Promise(
		(resolve, reject) => {
			let operator = (error, result) => {
				let feedback = new Result(error, result);
				return resolve(feedback);
			}
			params.push(operator);
			return mission.apply(executor, params);
		}
	);
}

module.exports = PromiseHandler;