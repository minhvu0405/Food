var Food = require('./models/food');
var express = require('express'); 
function getFood(res) {
    Food.find(function (err, allFood) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(allFood); // return all Food in JSON format
    });
}
;

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all Foods
    app.get('/api/food', function (req, res) {
        // use mongoose to get all Food in the database
        getFood(res);
    });

    // create Food and send back all Foods after creation
    app.post('/api/food', function (req, res) {

        // create a Food, information comes from AJAX request from Angular
        Food.create({
            name: req.body.name,
            price: req.body.price,
            done: false
        }, function (err, Food) {
            if (err)
                res.send(err);

            // get and return all the Food after you create another
            getFood(res);
        });

    });

    // get total prices 
    app.get('/api/total',function(req, res){
        Food.find(function(err,allFood){
            if (err) {
                res.send(err);
            }

            var subPrice = 0;
            for(var i = 0; i < allFood.length; i++)
            {
                if (allFood[i].price)
                {
                    subPrice += allFood[i].price;
                }
            }
            var total = subPrice*1.075
            res.send({total: total})
        });
    });

    // delete a Food
    app.delete('/api/food/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, Food) {
            if (err)
                res.send(err);

            getFood(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};