const amqp = require("amqplib/callback_api");
const promise = require("./promise.js");

const reconnect_delay = 5 * 1000;

/* CONSUMER CLASS */
const Consumer = function(connection) {
	this.connection = connection;
};

Consumer.prototype.consume = function(queue, consumer) {
	return promise.create(this.consumePromise, this, queue, consumer);
}

Consumer.prototype.consumePromise = function(queue, consumer, callback) {
	if (!(queue && consumer)) return callback("Missing params on Consumer::consume.", null);
	return this.connection.createChannel(
		(error, channel) => {
			if (error) return callback(error, false);
			channel.assertQueue(queue, {durable : true});
			channel.consume(queue,
				(message) => {
					if (message == null) return consumer("Wrong message.", null);
					message = message.content;
					
					try {
						message = JSON.parse(message);
					} catch (e) {
						return consumer("Can't parse message.", null);
					}

					return consumer(null, message);
				}
			, {noAck : true});
			return callback(null, true);
		}
	);
}

Consumer.prototype.close = function() {
	try {return this.connection.close();} catch (e) {return false;}
}

/* PUBLISHER CLASS */
const Publisher = function(connection) {
	this.connection = connection;
};

Publisher.prototype.publish = function(queue, payload) {
	return promise.create(this.publishPromise, this, queue, payload);
}

Publisher.prototype.publishPromise = function(queue, payload, callback) {
	if (!(queue && payload)) return callback("Missing params on Publisher::publish.", null);
	return this.connection.createChannel(
		(error, channel) => {
			if (error) return callback(error, false);

			payload = JSON.stringify(payload);

			channel.assertQueue(queue, {durable : true});
			channel.sendToQueue(queue, Buffer.from(payload));
			return callback(null, true);
		}
	);
}

Publisher.prototype.close = function() {
	try {return this.connection.close();} catch (e) {return false;}
}

/* RABBIT CLASS */
const Rabbit = function() {
	this.consumer;
	this.publisher;

	this.connection;
};

Rabbit.prototype.connect = function(url) {
	return promise.create(this.connectPromise, this, url);
}

Rabbit.prototype.connectPromise = function(url, callback) {
	// clear values
	try {this.connection.close();} catch (e) {};
	if (this.consumer) this.consumer.close();
	if (this.publisher) this.publisher.close();

	return amqp.connect(url,
		(error, connection) => {
			if (error) return callback(error, null);

			// setting connection
			this.connection = connection;
			this.connection.on("close",
				() => {
					return setTimeout(
						() => {
							return this.connect(url, callback);							
						}
					, reconnect_delay);
				}
			);

			// setting connection dependants
			this.consumer = new Consumer(connection);
			this.publisher = new Publisher(connection);

			return callback(null, true);
		}
	);
}

Rabbit.prototype.consume = function(queue, consumer) {
	return this.consumer.consume(queue, consumer);
}

Rabbit.prototype.publish = function(queue, payload) {
	return this.publisher.publish(queue, payload);
}

module.exports = Rabbit;