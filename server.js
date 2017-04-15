var path = require('path'),
    express = require('express'),
    app = express(),   
    Twit = require('twit'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/make-an-image-posting-twitter-bot/#creating-a-twitter-app*/      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter);

app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.all("/" + process.env.BOT_ENDPOINT, function (request, response) {
  var following = [];
  var cursor = '';
  var user = 'liquidx';
  
  var get_following = function(req_user, req_cursor) {
    var params = {screen_name: req_user, count: 1000};
    if (req_cursor) {
      params['cursor'] = req_cursor;
    }
    T.get('friends/ids', params, function(err, data, resp) {
      console.log(data);
      following = following.concat(data.ids);
      if (data.next_cursor) {
        //get_following(req_user, data.next_cursor);
        console.log(following.length);
        return
      } else {
        console.log(following.length);
      }
    });
  };
  get_following(user);
  response.send('OK');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
