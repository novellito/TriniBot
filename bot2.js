console.log('TriniBot is running!');

var Twit = require('twit');
var config = require('./js/config');
var rl = require('readline');


var T = new Twit(config);


var input = rl.createInterface(process.stdin, process.stdout);

input.question('what would you like to do?\n 1.create a tweet \n 2.follow a user\n 3.like something \n 4.retweet something \n> ', function (response) { //make 2 run followBot

    console.log(response);

    switch (response) {
        case '1':
            input.question('Enter the tweet: ', function (theTweet) {
                makeTweet(theTweet);
            });
            break;

        case '2':
            input.question('Enter the twitter username: ', function (username) {
                followUser(username);
            });
            break;

        case '3':
            input.question('What do you want to like (with a hashtag)?: ', function (something) {
                like(something);
            });
            break;

        case '4':
            input.question('What do you want to retweet (with a hashtag)?: ', function (something) {
                retweet(something);
            });
            break;

        default:
            console.log('you did nothing');
    }
});

// var stream = T.stream('user');
// stream.on('follow', followed);

// function followed(e)
// {
//     console.log('someone followed you!');
//     var name = e.source.name;
//     var screenName = e.source.screen_name;
//     makeTweet('@' + screenName + ' thanks for following! Welcome aboard');
// }

//allows user to link an image on google?
// function postPic()
// {
//     var b64 = fs.readFileSync('./doge.png', {encoding: 'base64'});

//     // first we must post the media to Twitter
//     T.post('media/upload', { media_data: b64 }, function (err, data, response) {
//     var mediaIdStr = data.media_id_string

//         if (!err) {
//         // now we can reference the media and post a tweet (media will attach to the tweet)
//         var params = { status: 'The First pic of many! woof', media_ids: [mediaIdStr] }

//         T.post('statuses/update', params, function (err, data, response) {
//             console.log('picture posted successfully');
//         })
//         }

//     });

// }
// postPic();


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


function followUser(user) {
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

function retweet(something) {
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

function followBot(input) {
    var params = {
        q: input, //it has to recently exist to work
        result_type: 'recent',
        lang: 'en'

    }


    T.get('users/search', params, function (err, data) {

        var numPeopleToFollow = 5;

        var i = 0;

        var myInterval = setInterval(function () { //follow a new user every x seconds      
            var newUser = data[i].screen_name;
            followUser(newUser);
        }, 4000);

        function followUser(theUser) {

            T.post('friendships/create', {
                screen_name: theUser
            }, followed); //put this inside the get function to follow whoever the user is

            function followed(err, data, response) {
                if (err) {
                    console.log('there was an error in following!');
                } else {

                    console.log('You followed: ' + theUser);

                    if (i == numPeopleToFollow) {
                        clearInterval(myInterval);
                        console.log('done');
                    }
                    i++;
                }
            }
        }
    });

}


function like(something) {
    var params = {
        q: something, //it has to recently exist to work
        result_type: 'recent',
        lang: 'en'

    }

    T.get('search/tweets', params, function (err, data) {

        var tweet = data.statuses;
        var randTweet = random(tweet);
        console.log(tweet);

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