var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exphbs = require('express-handlebars');
var twitFun = require('./js/twitFunctions');

///set up templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('home')
});

app.post('/', function (req, res) {
  if (typeof(req.body.theTweet) !== 'undefined') {
    twitFun.makeTweet(req.body.theTweet);
    res.send(req.body);

  }
  if (typeof(req.body.theUser) !== 'undefined') {
    twitFun.followUser(req.body.theUser);
    res.send(req.body);

  }
  if (typeof(req.body.theRetweet) !== 'undefined') {
    twitFun.retweet(req.body.theRetweet);
    res.send(req.body);

  }
  if (typeof(req.body.theLike) !== 'undefined') {
    twitFun.like(req.body.theLike);
    res.send(req.body);

  }

});

app.listen(3000, function () {
  console.log('listening on port 3000!')
});