//------------------------------------------------------------------------------------------------------------------------------------------------- VARIABLES ------------------------

//VARIABLES-----------------------------------------------------------------------------------------------------------------	---------------- USER VARIABLES ----------------------
var MongoClient = require('mongodb').MongoClient																		 //|	MONGO DB REQUIRED SCRIPT
var express = require('express');																						 //|	EXPRESS REQUIRED SCRIPT
var app = express();																									 //|	^^ EXPS REQD SCPT
var usr = ''; var pwd = '';	var fName = ''; var lName = ''; var email = '';												 //|	ESTABLISHING USER VARIABLES

//ERROR MESSAGE HTML-------------------------------------------------------------------------------------------------------|	---------------- HTML - ERROR MESSAGE ----------------
var errMsg = '<h3 color="red">ERROR: INVALID INPUT</h3><br/>' +															 //|	INFO IS ENTERED AT SIGN IN
			'<h5 color="red">PLEASE TRY AGAIN</h5><br />';																 //|					

//SIGN IN PAGE HTML--------------------------------------------------------------------------------------------------------|	---------------- HTML - SIGN IN ---------------------- 
var htmlSignIn ='<form action="http://localhost:4001/" method="POST">' +												 //|	CREATING A FORM ELEMENT (ACTION=LOCATION OF SERVER SIDE CODE & METHOD=HOW)
				'<label for="usr">Username: </label>' +																	 //|	LABEL FOR USR
				'<input name="usr" id="usr" type="text"/><br/>' +														 //|	USR
				'<label for="pwd">Password: </label>' +																	 //|	LABEL FOR PWD
				'<input name="pwd" id="pwd" type="password" /><br/>' +													 //|	PWD
				'<input type="submit" value="submit" />' +																 //|	SUBMIT
				'</form>' +																								 //|	END FORM
				'<a href="http://localhost:4001/createUser">Create User</a>';											 //|	CREATE USER LINK

var htmlSignInErr = errMsg + htmlSignIn;																				 //|	ERROR MESSAGE THEN HTML SIGN IN UNDERNEATH

//CREATE USER HTML---------------------------------------------------------------------------------------------------------|	---------------- HTML - CREATE USER ------------------
var htmlCreateUser = '<form action="http://localhost:4001/createUser" method="POST">' +									 //|	CREATING A FORM ELEMENT
				'<label for="fname">First Name: </label>' +																 //|	LABEL FOR FNAME
				'<input name="fName" id="fname" type="text" /><br />' +													 //|	FNAME
				'<label for="lname">Last Name: </label>' +																 //|	LABEL FOR LNAME
				'<input name="lName" id="lname" type="text" /><br />' +													 //|	LNAME
				'<label for="email">Email: </label>' +																	 //|	LABEL FOR EMAIL
				'<input name="email" id="email" type="email" /><br />' +												 //|	EMAIL
				'<label for="usr">Username: </label>' +																	 //|	LABEL FOR USR
				'<input name="usr" id="usr" type="text"/><br/>' +														 //|	USR
				'<label for="pwd">Password: </label>' +																	 //|	LABEL FOR PWD
				'<input name="pwd" id="pwd" type="password" /><br/>' +													 //|	PWD
				'<input type="submit" value="submit" />' +																 //|	SUBMIT
				'</form>' +																								 //|	END FORM
				'<a href="http://localhost:4001/signIn">Create User</a>';											 	 //|	SIGN IN LINK

//TASK FEED HTML------------------------------------------------------------------------------------------------------------	---------------- HTML - TASK FEED --------------------
var htmlTaskFeed = '<a href="http://localhost:4001/createTask">Create Task</a><br />' +									 //|	CREATE TASK LINK
					'<a href="http://localhost:4001/createUser">Create User</a><br />' +								 //|	CREATE USER LINK
					'<h2>Task Feed</h2>' +																				 //|	TASK FEED HEADER
					'<h5>Hello, ' + fname + '</h5>';																	 //|	GREET USER BY FIRST NAME

//CREATE TASK HTML----------------------------------------------------------------------------------------------------------	---------------- HTML - CREATE TASK ------------------
var htmlCreateTask = '<form action="http://localhost:4001/createTask" method="POST">' +									 //|	CREATING A FORM ELEMENT
					'<input name="task"+usr+"_" type="text">' +															 //|**	TEXT BOX INPUT
					'<input type="submit" value="submit">' +															 //|	SUBMIT
					'</form>';																							 //|	END FORM

//------------------------------------------------------------------------------------------------------------------------------------------------------FUNCTIONS---------------------

//DISPLAY TASK FEED MONGODB CODE--------------------------------------------------------------------------------------------	------------------- MONGO DB TASK FEED ---------------
function displayTaskFeed(){																								 //|
	MongoClient.connect('mongodb://localhost:4001/', function (err, db) {												 //|	CONNECT TO MONGO DB
		if (err) throw err																								 //|	IF NO DB IS FOUND, GIVE AN ERROR
		var dbCollection = db.collection('tasks');																		 //|	ASSIGN TASKS COLLECTION TO VARIABLE	
		dbCollection.find().toArray(function (err, documents) {															 //|	SEARCH COLLECTION, RETURN ALL TASKS TO AN ARRAY
			console.log(documents);																						 //|	LOG THE DOCUMENTS TO THE CONSOLE
			var htmlTaskFeedDB = '';																					 //|	VAR FOR CURRENT DB TASKS, BLANK START SO OLD TASKS DO NOT REMAIN
			for (x = 0 ; x < dbCollection.find().toArray().length ; x++){			  									 //|	TRAVERSE THE ARRAY (x=0, while x < length of array, execute code, then +1 to x)
				htmlTaskFeedDB = htmlTaskFeedDB+ '<p align="left" size="12pt">' + documents[x].task + 					 //|	ADD P ELEMENT TO HTML CONTAINING TASK
								 '<br/> <i>-@' + documents[x].usr + '</i> </p> <br/><br/>';		 						 //|	 & ITALICIZED USR ON NEXT LINE
			}																											 //|	
			db.close();																									 //|	CLOSE DB
		});																												 //|	END .FINDONE
	});																													 //|	END .CONNECT	
	res.send(htmlTaskFeed);																								 //|	SEND THE TASK FEED HTML
	res.send(htmlTaskFeedDB);																							 //|	SEND THE DB HTML CONTAINING TASKS/USRS
}																														 //|	END FUNCTION

//CREATE COLLECTIONS FOR DB ------------------------------------------------------------------------------------------------	----------------- CREATE DB COLLECTIONS --------------
MongoClient.connect('mongodb://localhost:4001/', function (err, db) {													 //|	CONNECT TO MONGO DB
	if (err) throw err																									 //|	IF NO DB IS FOUND, GIVE AN ERROR
	db.createCollection("users");																						 //|	CREATE USERS COLLECTION 
	db.createCollection("tasks");																						 //|	CREATE TASKS COLLECTION
});																														 //|	END .CONNECT

//-----------------------------------------------------------------------------------------------------------------------------------------------.GET/.POST/.LISTEN -------------------

//SIGN IN - DISPLAY	TO USER-------------------------------------------------------------------------------------------------	----------------------- SIGN IN -----------------------
app.get ('/', function(req,res){																						 //|	WHEN USER REQUESTS ROOT DIRECTORY
	console.log('SignIn');																								 //|	LOG STRING TO CONSOLE 
	res.sendFile(__dirname + '/logo.png');																				 //|	SEND STATIC LOGO FILE
	res.send(htmlSignIn);													 											 //|	SEND SIGN IN PAGE
});																														 //|	END .GET

//SIGN IN - CHECK DB FOR USR/PWD																						 //|	
app.post ('/', function(req,res){																						 //|	USER HITS SUBMIT BUTTON, THIS POST METHOD IS CALLED
	usr = req.body.usr;																									 //|	VARIABLE USR IS THE VALUE OF THE USR TEXT INPUT 
	pwd = req.body.pwd;																									 //|	VARIABLE PWD IS THE VALUE OF THE PWD PASSWORD INPUT	
	//code to check mongodb for usr/pwd match																			 //|	CHECK DB FOR USR/PWD MATCH
	MongoClient.connect('mongodb://localhost:4001/', function (err, db) {												 //|	CONNECT TO MONGO DB
		if (err) throw err																								 //|	IF NO DB IS FOUND, GIVE AN ERROR
		var dbCollection = db.collection('users');																		 //|	ASSIGN USERS COLLECTION TO VARIABLE
		dbCollection.findOne({'usr': usr},{'pwd': pwd}, function (err, document) {										 //|	FIND DOC IN COLLECTION WITH USR/PWD
			if(err){																									 //|	IF THERE ISNT ONE
				return console.log(err);																				 //|	RETURN THE ERR TO THE CONSOLE
				res.send(htmlSignInErr);																				 //|	DISPLAY SIGN IN PAGE WITH ERR MSG
			}																											 //|	
			else{																										 //|	IF THERE IS A USR/PWD MATCH
				fname = document.fname;		lname = document.lname; 	email = document.email;							 //|	SET USER VARIABLES TO USER DATA
				displayTaskFeed();																						 //|	DISPLAY TASK FEED
			}																											 //|
			db.close();																									 //|	CLOSE DB
		});																												 //|	END .FINDONE
	});																													 //|	END .CONNECT
});																														 //|	END .POST 

//CREATE USER - DISPLAY TO USER --------------------------------------------------------------------------------------------	------------------ CREATE USER ------------------------
app.get ('/createUser', function(req,res){																				 //|	WHEN USER REQUESTS CREATE USER DIR
	res.send(htmlCreateUser);																							 //|	SEND CREATE USER HTML AS A RESPONSE
});																														 //|	END .GET

//CREATE USER - CHECK DB FOR EMAIL/USR																					 //|
app.post ('/createUser', function(req,res){																				 //|	WHEN USER SENDS POST REQ. FOR CREATE USER DIR
	usr = req.body.usr;																									 //|	USR VAR = USERNAME ENTERED BY USER
	pwd = req.body.pwd;																									 //|	PWD VAR = PASSWORD ENTERED BY USER
	fName = req.body.fName;																								 //|	FNAME VAR = FIRST NAME ENTERED BY USER
	lName = req.body.lName;																								 //|	LNAME VAR = LAST NAME ENTERED BY USER
	email = req.body.email;																								 //|	EMAIL VAR = EMAIL ENTERED BY USER
	MongoClient.connect('mongodb://localhost:4001/createUser', function (err, db) {										 //|	CONNECT WITH MONGO DB
		if (err) throw err																								 //|	IF NO DB FOUND GIVE ERROR MSG
		var dbCollection = db.collection('users');																		 //|	VAR ESTD TO REPRESENT THE USERS COLLECTION
		dbCollection.findOne({'email': email}, function (document) {													 //|	SEARCH COLLECTION FOR DOCUMENT WITH MATCHING EMAIL
			if(document){																								 //|	IF EMAIL ALREADY IN USE
				return console.log('EMAIL ERR');																		 //|	LOG ERR TO CONSOLE
				alert('The EMAIL you entered is already in use, Please try a different one.');							 //|	ALERT USER THE EMAIL IS IN USE, USER CAN CHANGE INFO AND RETRY
			}																											 //|
			else{																										 //|	IF EMAIL IS NOT IN USE
				dbCollection.findOne({'usr': usr}, function (document) {												 //|	SEARCH COLLECTION FOR DOC WITH MATCHING USERNAME
					if(document){																						 //|	IF USERNAME ALREADY IN USE
						return console.log('USERNAME ERR');																 //|	LOG ERR TO CONSOLE
						alert('The USERNAME you entered is already in use, Please try a different one.');				 //|	ALERT USER THE USERNAME IS IN USER, USER CAN CHANGE AND RETRY
					}																									 //|
					else{																								 //|	IF USERNAME NOT IN USER ALREADY
						dbCollection.save({'fName': fName},{'lName': lName},{'email': email},{'usr': usr},{'pwd': pwd}); //|	SAVE USER INFORMATION TO USER COLLECTION IN DB
						res.send(htmlSignIn);																			 //|	RESPOND WITH SIGN IN HTML
					}																									 //|
				});																										 //|	END //.FINDONE - USERNAME
			}																											 //|
			db.close();																									 //|	CLOSE DATABASE
		});																												 //|	END .FINDONE - EMAIL
	});																													 //|	END .CONNECT
});																														 //|	END .POST

//TASK FEED - DISPLAY ------------------------------------------------------------------------------------------------------	---------------------- TASK FEED ---------------------
app.get('/taskFeed',function(){																							 //|	WHEN THE USER REQUESTS THE TASK FEED DIR
	displayTaskFeed();																									 //|	CALL FUNCTION DISPLAYTASKFEED() TO POPULATE TASK FEED
});																														 //|	END .GET

//CREATE TASK - DISPLAY ----------------------------------------------------------------------------------------------------	-------------------- CREATE TASK ---------------------
app.get('/createTask', function(){																						 //|	WHEN USER REQ'S CREATE TASK DIR
	res.send(htmlCreateTask);																							 //|	SEND CREATE TASK HTML
});																														 //|	END .GET

//CREATE TASK - SAVE TO DB WITH USERNAME
app.post('/createTask', function(){																						 //|	WHEN USER MAKES POST REQUEST TO CREATE TASK
	var dbCollection = db.collection('tasks');																			 //|	ASSIGN TASKS COLLECTION TO VARIABLE
	dbCollection.save({'task': req.body.task}, {'usr': usr})															 //|	ADD TASK TO 'TASKS' DB COLLECTION WITH USERNAME
	displayTaskFeed();																									 //|	DISPLAY THE TASK FEED AFTER SUBMITTING
});																														 //|	END .POST

//LISTEN ON PORT 3000-------------------------------------------------------------------------------------------------------	---------------- LISTENING ON PORT 3000 --------------
app.listen(3000,function(){																								 //|	EXPRESS IS LISTENING ON THIS PORT
	console.log('Listening on Port 3000');																				 //|	LOG STRING TO CONSOLE 
});																														 //|	END .LISTEN