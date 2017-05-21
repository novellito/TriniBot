var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

//create a new tweet
module.exports.makeTweet = (input) => {

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

module.exports.followUser = (user) => {
    T.post('friendships/create', {
        screen_name: user
    }, followed);

    function followed(err, data, response) {
        if (err) {
            console.log('there was an error in following!');
        } else {
            console.log('You followed: ' + user);
        }
    }
}

module.exports.retweet = (something) => {
    var params = {
        q: something, //it has to recently exist to work
        result_type: 'recent',
        lang: 'en'
    }

    T.get('search/tweets', params, function (err, data) {

        if (!err) {

            var retweetId = data.statuses[0].id_str; //retrieves the first status essentially
            T.post('statuses/retweet/:id', {
                id: retweetId
            }, function (err, response) {
                if (response) {
                    console.log('retweeted');
                }
                if (err) {
                    console.log('something went wrong with retweeting!');
                }
            });
        }
    });
}

module.exports.like = (something) => {
    var params = {
        q: something,
        result_type: 'recent',
        lang: 'en'

    }

    T.get('search/tweets', params, function (err, data) {

        var tweet = data.statuses;
        var randTweet = random(tweet);

        T.post('favorites/create', {
            id: randTweet.id_str
        }, function (err, response) {
            if (err) {
                console.log('error has occured when liking!');
            } else {
                console.log('favoriting went well!');
            }
        });
    });
}

function random(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
};