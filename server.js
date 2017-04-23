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
    query_object = {};
    bank_name = req.query.bank;
    if(bank_name) {
      query_object.company = bank_name;
    }
    skill = req.query.skill;
    if(skill) {
       skill = skill.replace(/\./g, '-');
       query_object['stats.' + skill] = { $gt: 0};
    }
    console.log("skill: " + skill);
    console.log("bank: " + bank_name);
    console.log("query_object: ");
    console.log(query_object);     
    Job.find(query_object).
      exec(function(err, jobs) {
      if(err) {
        res.send(err);
      } else {
        console.log('len: ' + jobs.length);
        res.json(jobs);
      }
    });
  });
// GET banks


app.use('/api', router);

app.listen(port);
