var express = require('express')
	, mongoose = require('mongoose')
	, ejs = require('ejs')
	, routes = require('./routesConfig')
//	, mongoStore = require('connect-mongodb')
	, DB = require('./accessDB').AccessDB;

var app = module.exports = express.createServer(express.logger());
global.app = app;

var DB = require('./accessDB');
var db = new DB.startup(process.env.MONGOLAB_URI);


// Twilio
var Twilio = require('twilio-js');
Twilio.AccountSid = "ACad716cc4da934be6ad19bf5353312248";
Twilio.AuthToken  = "3af91684fa2d040f587bf96955cffd82";

/*********** Database CONFIGURATION *****************/ 
//app.db = mongoose.connect(process.env.MONGOLAB_URI);

//require('./models').configureSchema(schema, mongoose);


//var SMS = mongoose.model('SMS');
//var Neighbor = mongoose.model('Neighbor');

/*********** End Database CONFIGURATION *****************/ 
    
/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/
    app.set('port', process.env.PORT || 3000);
    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname + '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    //parse any http form post
    app.use(express.cookieParser());//Cookies must be turned on for Sessions
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    

    /*** Turn on Express Sessions - Use MongoStore ***/
/*    app.use(express.session({ 
            store: mongoStore({url:process.env.MONGOLAB_URI})
            , secret: 'SuperSecretString'
        }, function() {
            app.use(app.router);
        })
    );
*/
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*

app.get('/', function(request, response) {
  response.render('layout.html');
});
*/


app.get('/neighbor', function(req, res){

	// This is a form to imitate information from an SMS
	res.send('<form method="POST" action="/neighbor">' +
					'Body: <input type="text" name="Body" />' +	
					'who is it going to: <input type="text" name="From" />' +	
					'Twilio Number: <input type="text" name="To" />' +									
					'<input type="submit" />'+
					'</form>');	

});

app.post('/neighbor', function(req, res){
	// Setup DB instance
	var neighbor = new Neighbor();
	var templateData;
	
	var needHelp = ['I need help', 'help', 'HELP', 'I want help']
	var help = ['I want to help','yes', 'YES', 'Yes'];
	var registration = ['EMERGENCIES', 'LABOR', 'SOCIALIZING'];
	var emergencies = ['a', 'A', 'EMERGENCIES', 'A)EMERGENCIES', 'emergencies', 'a)emergencies', 'A)emergencies' ];
	var labor = ['LABOR', 'b', 'B', 'labor', 'B)LABOR', 'b)labor', 'B)labor'];
	var social = ['SOCIALIZING', 'c', 'C', 'social','C)SOCIAL', 'c)social', 'C)social'];
	var defaultResponse = "To register, text 'I want to help.' to 1-646-461-2494";
	
	//Parse the parameters of the incoming SMS from twilio
	var body = req.body.Body;
	var from = req.body.From;
	var to = req.body.To;
	var date = req.body.date;
	
	// Return Messages
	var howHelp = "Thanks for registering with Building 1.  How are you willing to help? A)EMERGENCIES B)LABOR C)SOCIAL Choose all that apply.";
	var emergencyComplete = "Thanks for helping with EMERGENCIES.  We will send a text when a neighbor is in need of help or text your needs to 1-646-461-2494.";
	var	laborComplete = "Thanks for helping with LABOR.  We will send a text when a neighbor is in need of help or text your needs to this number.";
	var socialComplete = "Thanks for being SOCIAL.  We will send a text when a neighbor is in need or text your needs to this number.";
	var message = "Thanks for registering.";
	
	// Database Searching
	var queryTo = Neighbor.find( {to : to});
	var queryFrom = Neighbor.find( {number : from});
	var queryBody = Neighbor.find( {body : body});
	
	//Twilio Numbers: Building 1 : 16464612494, Building 2 : 16464612588, Building 3 : 16464612530
	// Building 4 : 16464309891, Building 5 : 16464025754,

	if( !(neighborNumber.indexOf(from) >= 0))
		neighborNumber.push(from);
		
	console.log('Body :' + body)

	switch(to) {
	case '+16464612494':
	console.log("building 1");
		
		queryFrom.exec(function (err, specificNumber){
		
			templateData = {
				neeighbor : specificNumber
			};
			console.log(templateData);
		});
		
		console.log('Template Data From : ' + templateData);
	
		if( (help.indexOf(body) >= 0 )) {
			message = howHelp;
		} else if( (emergencies.indexOf(body) >= 0)){
			message = emergencyComplete;
		} else if( (labor.indexOf(body) >= 0)){
			message = laborComplete;
		} else if( (social.indexOf(body) >= 0)){
			message = socialComplete;
		} else { message = defaultResponse }
	break;
	
	console.log('Message : ' + message);
/*
	
		if( body == 'I want to help' || body == 'yes' ){
			message = "Thanks for registering with Building 1.  How are you willing to help? A)EMERGENCIES B)CHORES/LABOR C)SOCIAL Choose all that apply.";
		} else if(body == 'a' || body == 'A' || body == 'EMERGENCIES' || body == 'A)EMERGENCIES' || body == 'emergencies' || body == 'a)emergencies') {
			message = "Thanks for helping with EMERGENCIES.  We will send a text when a neighbor is in need of help or text your needs to 1-646-461-2494."; 
		} else if (body == 'b' || body == 'B' || body == 'CHORES/LABOR' || body == 'B)CHORES/LABOR' || body == 'chores/labor' || body == 'b)chores/labor' || body == 'chores' || body == 'labor') {
			message = "Thanks for helping with CHORES/LABOR.  We will send a text when a neighbor is in need of help or text your needs to this number.";
		} else if (body == 'c' || body == 'C' || body == 'SOCIAL' || body == 'social' || body == 'C)SOCIAL' || body == 'c)social'){
			message = "Thanks for being SOCIAL.  We will send a text when a neighbor is in need or text your needs to this number.";
		} else { 
			message = "To register, text 'I want to help.' to 1-646-461-2494";
		}
*/
	break;
	case '+16464612588':
	console.log("building 2");
	break;
	case '+16464612530':
	console.log("building 2");
	break;
	case '+16464309891':
	console.log("building 4");
	break;
	case '+16464025754':
	console.log("building 5");
	break
	default:
	console.log("defaul");
	}

/*

	if(to == '+16464612494'){
		if( body == 'I want to help' || 'yes' ){
			message = "Thanks for registering with Building 1.  How are you willing to help? A)EMERGENCIES B)CHORES/LABOR C)SOCIAL Choose all that apply.";
		} else if(body == 'a' || 'A' || 'EMERGENCIES' || 'A)EMERGENCIES' || 'emergencies' || 'a)emergencies') {
			message = "Thanks for helping with EMERGENCIES.  We will send a text when a neighbor is in need of help or text your needs to this number."; 
		} else if (body == 'b' || 'B' || 'CHORES/LABOR' || 'B)CHORES/LABOR' || 'chores/labor' || 'b)chores/labor' || 'chores' || 'labor') {
			message = "Thanks for helping with CHORES/LABOR.  We will send a text when a neighbor is in need of help or text your needs to this number.";
		} else if (body == 'c' || 'C' || 'SOCIAL' || 'social' || 'C)SOCIAL' || 'c)social'){
			message = "Thanks for being SOCIAL.  We will send a text when a neighbor is in need or text your needs to this number.";
		} else { 
			message = "To register, text 'I want to help.' to 1-646-461-2494";
		}
	} else if(to == '+16464612588' ) {
		message = "Thanks for registering with Building 2.";
	} else if(to == '+16464612530' ) {
		message = "Thanks for registering with Building 3.";
	} else if(to == '+16464309891' ) {
		message = "Thanks for registering with Building 4.";
	} else if(to == '+16464025754' ) {
		message = "Thanks for registering with Building 5.";
	} else {
		message = "Thanks for registering.";
	}
*/
	console.log(message);
	// Registration Function:
	// Start with: 'I want to help"
	// Thanks for contacting neighbors of ______(Building).  To signu up, reply 'I want to help'.
	// Thanks for registering.  How are you willing to help? A)EMERGENCIES B)CHORES/LABOR C)SOCIAL? Choose all that apply.
		// if nothing 
	// B
	// Thanks for 'helping with ________'.  We will send a text when a neighbor is in need of help.  If you need help, text this number otherwise we  
	// We will send a text when a neighbor needs 'help with _______a'.  If you need help, text your needs to 88888. 


	//Help Function:
	//
	// I need help with ___ at __(time) at __(apartment). 
	//
	// We have contacted your neighbors and will update you shortly.
	//
	// send sms to people who are registered
	// 
	// A neighbor needs help with ______ at _(time)_ at _(location)_.  Text YES if you can help.
	//
	// if YES - Thanks for helping your neighbor!
	// if NO - Thanks.  Maybe next time.
	//
	// after a half hour - neighbors are unavailable
	//	
	// Send a text to those signed up with 10



/*
	Twilio.SMS.create({to: from, from: to, body: message}, function(err,res) {
		console.log('Up Up and Away...SMS Sent!');
	});
*/
	
	neighbor.number = from;
	neighbor.to = to;
	neighbor.body = body;
	neighbor.save();
	
	res.redirect('/number')

});


app.get('/number',function(request, response){

    // Get the request blog post by urlslug
    Neighbor.find({},function(err, numberInfo){

        if (err) {
            console.log(err);
            response.send("an error occurred!");
        }

        if (numberInfo == null ) {
            console.log('number not found');
            response.send("uh oh, can't find that number");

        } else {
	       // console.log(numberInfo);
	        
	        templateData = {
		        Neighbor : numberInfo
		        
	        };
            // use different layout for single entry view
           // post.layout = 'layout_single_entry.html';

            // found the blogpost
            response.render('number_single_entry.html', templateData);
        }
    });
});


app.get('/number/:to',function(request, response){

	var numberTo = request.params.to;
	var query = Neighbor.find( {to : numberTo});
	
	query.exec(function (err, specificNumber){
		
		templateData = {
			Neighbor : specificNumber
		};

		response.render('number_single_entry.html', templateData);
	});

});

app.get('/numberDelete/:to',function(request, response){
	
	var numberTo = request.params.to;
	var query = Neighbor.remove( {to : numberTo});
	
	query.exec(function (err, specificNumber){
		response.redirect('/number');
	});

});

require('./routesConfig')(app);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});