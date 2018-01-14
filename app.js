const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
//setup the express app
const app = express();
var pg = require('pg');//postgres client for node
var format = require('pg-format');//allows us safely make dynamic queries
var PGUSER = 'null';
var PGDATABASE = 'niktechnopro';	
var age = 732;
//log requests to the console
app.use(logger('dev'));
//parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//configuration for database
var config = {
	// user: PGUSER,
	database: PGDATABASE,
	max: 10,//max number of clients in the pool
	idleTimeoutMillis: 30000 //how long client can idle before being closed
}

var pool = new pg.Pool(config);//new pool of clients according to config
// console.log(pool)
pool.connect(function(error){
	if(error){
		console.log("error connecting to database ",error)
	}else{
		console.log("successful connect to database")
	}
})


app.get('*', (req, res)=>{
	var ageQuery = format('SELECT * from numbers');
	pool.query(ageQuery, function(error, result){
		if(error){
			console.log(error)
		}else{
			let numbers = result.rows.map((age)=>{return age.age})
			console.log(numbers)
			res.status(200).send({
				message: `first read from DB ${PGDATABASE} is ${numbers}`

			})
		}
	})
})




//setup a default catch-all route that sends back a welcome message in JSON format;
app.get('*', (req, res) => res.status(200).send({
	message: "Welcome to the beginning"
}));

module.exports = app;
