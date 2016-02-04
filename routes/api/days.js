var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

//get all days
router.get('/days', function(req, res, next) { //
	Day.find({}).populate('hotel restaurants activities').exec()
	.then(function (days){
		res.json(days);
	})
	.then(null, next);
})

//create a new day
router.post('/days', function(req, res, next) { //
	Day.create(req.body)
	.then(function (newDay) {
		res.json(newDay);
	})
	.then(null, next);
})

//add attraction to specific day
router.post('/days/:id/:attraction', function(req, res, next) { //
	res.send('This is a post attraction route');
})

//get one specific day
router.get('/days/:id', function(req, res, next) { //
	Day.findById(req.params.id).populate('hotel restaurants activities').exec()
	.then(function (day){
		res.json(day);
	})
	.then(null, next);
})

//delete one specific day
router.delete('/days/:id', function(req, res, next) { //
	Day.findById(req.params.id)
	.then(function (foundDay) {
		foundDay.remove();
		res.send({message: "It was deleted"})
	})
	.then(null, next);

})

//delete attraction for specific day
router.delete('/days/:id/:attraction', function(req, res, next) { //
	res.send('This is a delete specific attraction on day route');
})


module.exports = router;
