var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res){

        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('input', {} );
        });

    });

    app.get('/movies', function(req, res){

        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });

    });

    app.post('/movies', function(req, res, next) {
      var title = req.body.title;
      var year = req.body.year;
      var imdb = req.body.imdb;

      db.collection('movies').insertOne(
        { 'title': title, 'year': year, 'imdb': imdb },
        function (err, r) {
          assert.equal(null, err);
          res.send("Document inserted with _id: " + r.insertedId);
        }
      );
    });

    app.use(function(req, res){
        res.sendStatus(404);
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});




