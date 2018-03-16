'use strict';

var path = process.cwd();
var SearchHandler = require(path + '/app/controllers/searchHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.json({});
		}
	}

  var searchHandler = new SearchHandler();
  var redirectURL = '/';
  var redirectObj = {
    successRedirect: redirectURL,
    failureRedirect: redirectURL
  };

  app.route('/auth/github')
   .all(function(req, res, next) {
     redirectURL = req.get('Referrer');
     redirectObj.successRedirect = redirectURL;
     redirectObj.failureRedirect = redirectURL;
     return next();
   })
   .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', redirectObj));

  app.route('/logout')
  	.get(function (req, res) {
  		req.logout();
  		res.json({});
	});

  app.route('/api/user')
    .get(isLoggedIn, function (req, res) {
      res.json(req.user.github)
    });

  app.route('/api/user/:id')
  	.get(isLoggedIn, function (req, res) {
  		res.json(req.user.github);
	});

  app.route('/api/search/:location')
		.get(searchHandler.getBars);

  app.route('/api/bars')
		.post(isLoggedIn, searchHandler.editAttendees);

	app.route('*')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

};
