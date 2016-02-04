'use strict';
/* global $ attractionsModule */

var daysModule = (function(){

  // state (info that should be maintained)

  var days = [],
      currentDay;

  // jQuery selections

  var $dayButtons, $dayTitle, $addButton, $removeDay;
  $(function(){
    $dayButtons = $('.day-buttons');
    $removeDay = $('#day-title > button.remove');
    $dayTitle = $('#day-title > span');
    $addButton = $('#day-add');
  })

  // Day class

  function Day (hotel, restaurants, activities) {
    this.hotel = hotel || null;
    this.restaurants = restaurants || [];
    this.activities = activities || [];
    this.number = days.push(this);
    this.buildButton().drawButton();
  }

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function(){
      this.blur();
      self.switchTo();
    })
    return this;
  };

  Day.prototype.drawButton = function() {
    this.$button.appendTo($dayButtons);
    return this;
  };


  Day.prototype.switchTo = function() {
    // day button panel changes

    currentDay.$button.removeClass('current-day');

    // itinerary clear
    function erase (attraction) { attraction.eraseItineraryItem(); }
    if (currentDay.hotel) erase(currentDay.hotel);
    currentDay.restaurants.forEach(erase);
    currentDay.activities.forEach(erase);

    // front-end model change
    currentDay = this;

    // day button panel changes
    currentDay.$button.addClass('current-day');
    $dayTitle.text('Day ' + currentDay.number);

    // itinerary repopulation
    function draw (attraction) { attraction.drawItineraryItem(); }
    if (currentDay.hotel) draw(currentDay.hotel);
    currentDay.restaurants.forEach(draw);
    currentDay.activities.forEach(draw);

    return currentDay;
  };

  // private functions in the daysModule

  function addDay () {
    if (this && this.blur) this.blur();
    var newDay = new Day();
    if (days.length === 1) currentDay = newDay;
    newDay.switchTo();
  }

  function deleteCurrentDay () {
    console.log('will delete this day:', currentDay);
    console.log(days);
    // $('#day-title').empty(); //empties "Day current"

    // days[currentDay.number-1].switchTo();
    $('#day-number').text('Day ' + (currentDay.number-1));
    currentDay.$button.remove();
    days.pop(); //remove the object of the last day
    console.log(days, 'after pop');
    currentDay = days[days.length-1];
    // currentDay.$button; //we have to switch to the new current day
    console.log(currentDay, "after everythng");
  }

  // jQuery event binding

  $(function(){
    $addButton.on('click', addDay);
    $removeDay.on('click', deleteCurrentDay);
  })

  function assimilate(responseData) {

    //take data from backend and put into days object into the frontend
    responseData.forEach(function (day) {
    
      var newDay = new Day(day.hotel, day.restaurants, day.activities);

    });

  }

  // globally accessible methods of the daysModule

  var methods = {

    load: function(){
      //add all the AJAX requests
      $.ajax({
        method: 'GET',
        url: '/api/days',
        success: function (responseData) {//response data is an array of objects or nothing. the front end's copy
          assimilate(responseData);
          if (days.length === 0) {
              $(addDay);
          } 
    


          days.forEach(function (day) {
            if (day.hotel){
              day.hotel.type = 'hotel';
              day.hotel = attractionsModule.create(day.hotel);
            };
            day.restaurants.forEach(function (restaurant, i) {
              restaurant.type = 'restaurant';
              day.restaurants[i] = attractionsModule.create(restaurant);
            });
            day.activities.forEach(function (activity, i) {
              activity.type = 'activity';
              day.activities[i] = attractionsModule.create(activity);
            });
            
          })

          currentDay = days[0];

          currentDay.switchTo();
        },
        error: function (errorObj) {
        // some code to run if the request errors out
          console.error(errorObj);
        }
      });

      

    },

    addAttraction: function(attractionData){
      var attraction = attractionsModule.create(attractionData);
      switch (attraction.type) {
        case 'hotel': currentDay.hotel = attraction; break;
        case 'restaurant': currentDay.restaurants.push(attraction); break;
        case 'activity': currentDay.activities.push(attraction); break;
        default: console.error('bad type:', attraction);
      }
    },

    getCurrentDay: function(){
      return currentDay;
    }

  };

  // we return this object from the IIFE and store it on the global scope
  // that way we can use `daysModule.load` and `.addAttraction` elsewhere

  return methods;

}());
