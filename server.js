const MongoClient = require('mongodb').MongoClient

console.log("Hello World!");

// call the packages we need
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()     // define our app using express

// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine','ejs');

// get an instance of the express Router
//var router = express.Router();

// a “get” at the root of our web app: http://localhost:3000/api
var dogID=0;
app.get('/', function(req, res) {
  db.collection('dogs').find({}).toArray((err, result) => {
    if(err){return console.log(err)};
   res.render('index.ejs', {dogs: result});

dogID=0;
   for(var i=0; i<result.length; i++){
     dogID++;
   }
 })
});

app.get('/editDogs/:dogID', function(req,res) {
  var thisDogID = parseInt(req.params.dogID);

  db.collection('dogs').find({dogID:thisDogID}).toArray(function(err,result) {
  res.render('detail.ejs', {dogDetails: result[0]})
  })
})

app.get('/delete/:dogID', function(req,res) {
  var thisDogID = parseInt(req.params.dogID);
  console.log(thisDogID)
  db.collection('dogs').deleteOne({dogID:thisDogID})
  res.redirect('/');
})

app.post('/editSubmit', function(req, res) {
  var a = req.body.dogName
  var b = req.body.favoriteToy
  var c = req.body.ownerName
  console.log(c)

  db.collection('dogs').updateOne({"dogID": thisDogID}, { $set: {"dogName" : a, "favoriteToy" : b, "ownerName" : c } },
      { upsert: true });

  res.redirect('/');

})


app.post('/formSubmit', function (req, res) {
  var a = req.body.dogName
  var b = req.body.favoriteToy
  var c = req.body.ownerName
  var d = Math.floor((Math.random() * 10) + 1);
  var e = dogID+1;

  if( a != ""){
    db.collection('dogs').save({dogName:a, favoriteToy:b, ownerName:c, dogPictureNumber:d, dogID:e})
  }

  res.redirect('/');
})



var db
var url = "mongodb://tegan:chick3n@ds052408.mlab.com:52408/allyn-database";
MongoClient.connect(url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database.db('allyn-database')  //sets database var equal to global db var above
  var port = process.env.PORT || 80
  app.listen(port, () => {
    console.log('listening on 3000')
  })
})
