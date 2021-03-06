//export to web.js

module.exports.configureSchema = function(Schema, mongoose) {
	
	
	SMS = new Schema({
		from: String,
		body: String,
		date: { type: Date, default: Date.now }
	});

	
	Neighbor = new Schema({
		number:	String,
		to:		String,
		body:	String,
		date:	{ type: Date, default: Date.now }
	});
	
	mongoose.model('SMS', SMS);
	mongoose.model('Neighbor', Neighbor);
};
