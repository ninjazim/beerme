'use strict';

var Bar = require('../models/bars.js');
var User = require('../models/users.js');
var axios = require('axios');

function SearchHandler () {
  axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.YELP_KEY}`;


  this.getYelpData = (location, offset) => {
    var baseUrl = 'https://api.yelp.com/v3/businesses/search?categories=bars&sort_by=rating';
    var fullUrl = `${baseUrl}&location=${location}&offset=${offset}`;
    return (axios.get(fullUrl)
         .then(response => {
           return response.data;
         })
         .catch(error => {
           throw error
         })
    );
  }

  this.getBarAttendees = async (business) => {
      let bar = Bar.findOne({yelpId: business.id}).exec();
      let attendees = await bar.then((b) => {
        if (!b) {
          return [];
        } else {
          return b.attendees;
        }
      })
      return attendees;
    };

  this.mapBusinesses = async (businesses) => {
    let updated = [];
    for (let business of businesses) {
      updated.push({
        ...business,
        attendees: await this.getBarAttendees(business)
      });
    }
    return updated;
  }

  this.getBars = (req, res) => {
    this.getYelpData(req.params.location, req.query.offset)
        .then(response => {
          return new Promise((resolve, reject) => {
            this.mapBusinesses(response.businesses).then((result) => {
              resolve({
                ...response,
                businesses: result
              });
            });
          });
        })
        .then(response => {
          res.json(response);
        });
  }

  this.locationSearch = function (req, res) {
    var baseUrl = 'https://api.yelp.com/v3/businesses/search?categories=bars&sort_by=rating';
    var offset = req.query.offset;
    var fullUrl = `${baseUrl}&location=${req.params.location}&offset=${offset}`;
    axios.get(fullUrl)
         .then(response => {
           res.json(response.data);
         })
         .catch(error => {
           throw error
         });
  };

  this.getAttendees = function (req, res) {
    Bar
      .findOne({yelpId: req.params.id})
      .exec(function (err, bar) {
        if (err) { throw err; }
        if (!bar) {
          res.json({ attendees: [] });
        } else {
          res.json({ attendees: bar.attendees })
        }
      });
  }

  this.editAttendees = function (req, res) {
    var businessId = req.body.businessId;
    var userIsGoing = req.body.going;
    console.log('businessId:',businessId);
    var user = req.user;
    console.log(user);
    Bar
      .findOne({yelpId: businessId})
      .exec(function (err, bar) {
        if (err) { throw err; }
        if (!bar) {
          var newBar = new Bar();
          newBar.yelpId = businessId;
          if (userIsGoing) {
            newBar.attendees = [{
              username: user.github.username,
              date: new Date(),
            }];
          } else {
            newBar.attendees = [];
          }
          newBar.save(function (err, savedBar) {
            if (err) { throw err; }
            console.log("bar added");
            res.json(savedBar);
          });

        } else {
          var attendees = bar.attendees;
          if (userIsGoing) {
            var findUserInAttendees = attendees.filter(function(attendee) {
              return attendee.username === user.github.username;
            });
            if (findUserInAttendees.length > 0) {
              console.log("user already going");
              res.json(bar);
            } else {
              attendees.push({
                username: user.github.username,
                date: new Date()
              });
              bar.save( function(err, updatedBar) {
                if (err) { throw err; }
                console.log("user added");
                res.json(updatedBar);
              });
            }
          } else {
            var filteredAttendees = attendees.filter(function(attendee) {
              return attendee.username !== user.github.username;
            });
            bar.attendees = filteredAttendees;
            bar.save( function(err, updatedBar) {
              if (err) { throw err; }
              console.log("user removed");
              res.json(updatedBar);
            });
          }
        }
      });
    }
  };

module.exports = SearchHandler;
