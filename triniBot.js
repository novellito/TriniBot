console.log('TriniBot is running!');

var Twit = require('twit');
var config = require('./js/config');
var T = new Twit(config);
var sentiment = require('sentiment');

var stream = T.stream('statuses/filter', {track: 'wow,much,very,doge,such'})
var i = 0;
stream.on('tweet', function (tweet) {

    var replyTo = tweet.user.screen_name;
    var analyzeText = sentiment(tweet.text);

    if (analyzeText.score < 0) {
        console.log(tweet.text);
        makeTweet('MuCh sAdnEsS vErY sAd DoGe NoT wOw @' + replyTo);
    } else if (analyzeText.score > 0) {
        console.log(tweet.text);
        makeTweet('MuCh nIcE HaPpY dOge sUcH jOy wOw @' + replyTo);
    } else {
        console.log(tweet.text);
        makeTweet('very neutral doge :) @' + replyTo);
    }

    i++; 
    if (i == 14) {
        i = 0;
        stream.stop();
        setTimeout(() => {
            stream.start();
        }, 2400000) //every 40 minutes
        console.log('sleeping!');
    }
});

var streamReply = T.stream('user')
streamReply.on('tweet', function (tweet) {

    var mention = tweet.in_reply_to_screen_name;
    var replyTo = tweet.user.screen_name;
    if (mention === 'trini_bot') {
        var rep = '@' + replyTo + ' vErY tWeEt MuCh SoCiAl DoGe'
        makeTweet(rep);
    }

});

var followStream = T.stream('user');
followStream.on('follow', followed);

function followed(e) {
    console.log('someone followed you!');
    var name = e.source.name;
    var screenName = e.source.screen_name;
    makeTweet('@' + screenName + ' MuCh foLlOwErS VeRy ThAnKs');
}

function makeTweet(input) {

    var tweet = {
        status: input
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log('there was an error in making the tweet!');
        } else {

            console.log('tweeted successfully!');
        }
    }
}
