const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
//setup the express app
const app = express();
var pg = require('pg');//postgres client for node
var format = require('pg-format');//allows us safely make dynamic queries
var PGUSER = 'null';
var PGDATABASE = 'niktechnopro';
var Sequelize = require('sequelize');//capital because this is a construction function
//log requests to the console
app.use(logger('dev'));
//parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var connection = new Sequelize('postgres', 'bob', '', {dialect: 'postgres'});//returns an object that represents a connection to a database
// it needs 3 arguments: name of database, username and password + 1 more - dialict object specifying db engine
// when we run sequelize init from command line - it creates config.json
// let's create a model - it correcponds to a table
var Article = connection.define('article', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
})
//if table is not in place - it will be created
//sync() creates the tables behind the scenes if not exists
//promises are needed because sync() may take time
// model have methods like findById or findAll()
// connection.sync().then(function(){ }) - template



connection.sync().then(function(){
	Article.findAll().then(function(article){
		console.log(article.length)
	})
});


//configuration for database without sequelize

// var config = {
// 	host: 'localhost',
// 	// user: PGUSER,
// 	database: PGDATABASE,
// 	max: 10,//max number of clients in the pool
// 	idleTimeoutMillis: 30000 //how long client can idle before being closed
// }
// var connection = new Sequelize();//returns an object that represents a connection to a database
// var pool = new pg.Pool(config);//new pool of clients according to config
// // console.log(pool)
// pool.connect(function(error){
// 	if(error){
// 		console.log("error connecting to database ",error)
// 	}else{
// 		console.log("successful connect to database")
// 	}
// })
// app.all('*', (req, res)=>{
// 	var ageQuery = format('SELECT * from numbers');
// 	pool.query(ageQuery, function(error, result){
// 		if(error){
// 			console.log(error)
// 		}else{
// 			let numbers = result.rows.map((age)=> age.age)
// 			console.log(numbers)
// 			res.status(200).send({
// 				message: `first read from DB ${PGDATABASE} is ${numbers}`

// 			})
// 		}
// 	})
// })

//configuration to a database without sequalize -- end


module.exports = app;
