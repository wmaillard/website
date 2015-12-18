var express = require('express');
var app = express();

var session = require('express-session');
app.use(session({secret:'pword'}));

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var mongo = require('./mongo.js');
console.log('oi');
mongo();

var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.use(express.static('public'));

app.set('port', 3001);

app.get('/select', function(req, res, next){

	pool.query('SELECT * FROM workouts', function(err, rows, fields){
		
	if(err)
	{
		next(err);
		return;
	}
	for(var i = 0; i < rows.length; i++)
	{
		var d = new Date(rows[i].date);
		rows[i].date = d.toUTCString();
		rows[i].date = rows[i].date.slice(0,16);
	}
	var context = JSON.stringify(rows);
	res.status(200).send(context);
	
})
});


app.get('/', function(req, res, next){
	res.render('home');
});

app.get('/reset-table',function(req,res,next){
  var context = {};
	pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/insert',function(req,res,next){
  pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
	pool.query('SELECT * FROM workouts where id = ?', [result.insertId], function(err, rows, fields){
		
	if(err)
	{
		next(err);
		return;
	}
		res.status(200).send(rows);
  });

});
});

app.get('/update',function(req,res,next){
  pool.query("UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
	pool.query('SELECT * FROM workouts where id = ?', [req.query.id], function(err, rows, fields){
		
	if(err)
	{
		next(err);
		return;
	}
		res.status(200).send(rows);
  });

});
});
 
app.get('/delete',function(req,res,next){
  pool.query("DELETE FROM workouts WHERE id = ?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
	res.sendStatus(200);
  }); 
 });


app.use(function(req, res){
	res.status(404);
	res.render('404');
})

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
})

app.listen(app.get('port'), function(){
	console.log('running');
})