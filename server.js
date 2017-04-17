/**
 * Created by rookiebird on 2017-04-15.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JobSchema = new Schema({name: String});

mongoose.connect('mogodb://localhost:27017');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT  || 8080;
var router = express.Router();

router.get('/', function(req, res){
    res.json({message:'done!'});
});

app.use('/api', router);

app.listen(port);