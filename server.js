/**
 * Created by rookiebird on 2017-04-15.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Job = require('./app/models/job');

mongoose.connect('mongodb://localhost:27017/job_bank_db');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT  || 8080;
var router = express.Router();

router.get('/', function(req, res){
    res.json({message:'done!'});
});


// GET jobs
router.route('/jobs')
  .get(function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    query_object = {};
    var bank_name = req.query.bank;
    if(bank_name) {
      query_object.company = bank_name;
    }
    var skill = req.query.skill;
    if(skill) {
       skill = skill.replace(/\./g, '-');
       query_object['stats.' + skill] = { $gt: 0};
    }
    var page = req.query.page;
    if(page) {
      page = parseInt(page);
    } else {
      page = 0;
    }
    var page_size = req.query.page_size;
    if(page_size) {
      page_size = parseInt(page_size);
    } else {
      page_size = 20;
    }
    var skip = page_size * page;
    Job.find(query_object).
      limit(page_size).
      skip(skip).
      exec(function(err, jobs) {
      if(err) {
        res.send(err);
      } else {
        res.json(jobs);
      }
    });
  });
// GET banks


app.use('/api', router);

app.listen(port);
