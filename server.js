/**
 * Created by rookiebird on 2017-04-15.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Job = require('./app/models/job');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/job_bank_db');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function (req, res) {
  res.json({message: 'done!'});
});


// GET jobs
router.route('/jobs')
  .get(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    query_object = {};
    var bank_name = req.query.bank;
    if (bank_name) {
      query_object.company = bank_name;
    }
    var skill = req.query.skill;
    if (skill) {
      skill = skill.replace(/\./g, '-');
      query_object['stats.' + skill] = {$gt: 0};
    }
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
    } else {
      page = 0;
    }
    var page_size = req.query.page_size;
    if (page_size) {
      page_size = parseInt(page_size);
    } else {
      page_size = 20;
    }
    var skip = page_size * page;

    Job.find(query_object)
      .sort('-post_date')
      .limit(page_size)
      .skip(skip)
      .exec(function (err, jobs) {
        if (err) {
          res.send(err);
        } else {
          Job.count(query_object, function (err, c) {
            result = {count: c, jobs: jobs};
            res.json(result);
          });
        }
      });
  });

// GET stats
// db.jobs.aggregate(
//   [{$group:
//       {
//         _id: null,
//         java: { $sum: "$stats.Java"},
//         Agile: {$sum: "$stats.Agile"}
//       }
//    } ])
router.route('/stats')
  .get(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    var bank = req.query.company;
    var match = {};
    if (bank) {
      match = {"company": bank};
    }

    Job.aggregate([
      {
        "$match": match
      },
      {
        "$group": {
          "_id": null,
          "Agile": {$sum: "$stats.Agile"},
          "Linux/Unix": {$sum: "$stats.Linux/Unix"},
          "AIX": {$sum: "$stats.AIX"},
          "Windows": {$sum: "$stats.Windows"},
          "Tomcat": {$sum: "$stats.Tomcat"},
          "Websphere": {$sum: "$stats.Websphere"},
          "Weblogic": {$sum: "$stats.Weblogic"},
          "Nginx": {$sum: "$stats.Nginx"},
          "Jboss": {$sum: "$stats.Jboss"},
          "IIS": {$sum: "$stats.IIS"},
          "Zookeeper": {$sum: "$stats.Zookeeper"},
          "Kafka": {$sum: "$stats.Kafka"},
          "DB/Database/Databases/DBMS": {$sum: "$stats.DB/Database/Databases/DBMS"},
          "MySQL": {$sum: "$stats.MySQL"},
          "DB2": {$sum: "$stats.DB2"},
          "Oracle": {$sum: "$stats.Oracle"},
          "Netezza": {$sum: "$stats.Netezza"},
          "Postgres": {$sum: "$stats.Postgres"},
          "Redis": {$sum: "$stats.Redis"},
          "Memchached": {$sum: "$stats.Memcached"},
          "Hive": {$sum: "$stats.Hive"},
          "Cassandra": {$sum: "$stats.Cassandra"},
          "DynamoDB": {$sum: "$stats.DynamoDB"},
          "SimpleDB": {$sum: "$stats.SimpleDB"},
          "Elasticsearch": {$sum: "$stats.Elasticsearch"},
          "Firebase": {$sum: "$stats.Firebase"},
          "FoundationDB": {$sum: "$stats.FoundationDB"},
          "Lucene": {$sum: "$stats.Lucene"},
          "MariaDB": {$sum: "$stats.MariaDB"},
          "Neo4j": {$sum: "$stats.Neo4j"},
          "SQLite": {$sum: "$stats.SQLite"},
          "SQLserver/SQL server": {$sum: "$stats.SQLserver/SQL server"},
          "NoSQL": {$sum: "$stats.NoSQL"},
          "MongoDB": {$sum: "$stats.MongoDB"},
          "CouchDB": {$sum: "$stats.CouchDB"},
          "Perl": {$sum: "$stats.Perl"},
          "Bash/Shell": {$sum: "$stats.Bash/Shell"},
          "Erlang": {$sum: "$stats.Erlang"},
          "Golang/Google Go": {$sum: "$stats.Golang/Google Go"},
          "PHP": {$sum: "$stats.PHP"},
          "Smalltalk": {$sum: "$stats.Smalltalk"},
          "Java": {$sum: "$stats.Java"},
          "JaveEE/Jave EE/J2EE": {$sum: "$stats.JavaEE/Java EE/J2EE"},
          "Spring": {$sum: "$stats.Spring"},
          "Structs": {$sum: "$stats.Structs"},
          "Hibernate": {$sum: "$stats.Hibernate"},
          "Maven": {$sum: "$stats.Maven"},
          "Gradle": {$sum: "$stats.Gradle"},
          "JDBC": {$sum: "$stats.JDBC"},
          "Solr": {$sum: "$stats.Solr"},
          "Android": {$sum: "$stats.Android"},
          "iOS": {$sum: "$stats.iOS"},
          "Net": {$sum: "$stats.-Net/ASP-NET"},
          "C#": {$sum: "$stats.C#"},
          "Xamarin": {$sum: "$stats.Xarmarin"},
          "C": {$sum: "$stats.C"},
          "C++": {$sum: "$stats.C++"},
          "nodejs": {$sum: "$stats.Node-js/nodejs"},
          "Javascript/Java script/JS": {$sum: "$stats.Javascript/Java script/JS"},
          "Angular": {$sum: "$stats.Angular"},
          "react": {$sum: "$stats.react"},
          "Expressjs": {$sum: "$stats.Express-js/Expressjs"},
          "Bootstrap": {$sum: "$stats.Bootstrap"},
          "Python": {$sum: "$stats.Python"},
          "TensorFlow": {$sum: "$stats.TensorFlow"},
          "Scikit-learn/Scikit learn": {$sum: "$stats.Scikit-learn/Scikit learn"},
          "Django": {$sum: "$stats.Django"},
          "Machine learning": {$sum: "$stats.Machine learning"},
          "Jenkins": {$sum: "$stats.Jenkins"},
          "Travis": {$sum: "$stats.Travis/travis-ci"},
          "Selenium": {$sum: "$stats.Selenium"},
          "UrbanCode Deploy/UCD": {$sum: "$stats.UrbanCode Deploy/UCD"},
          "Chef": {$sum: "$stats.Chef"},
          "Ansible": {$sum: "$stats.Ansible"},
          "Cloud": {$sum: "$stats.Cloud"},
          "REST/Restful": {$sum: "$stats.REST/Restful"},
          "SOAP": {$sum: "$stats.SOAP"},
          "API/web service/webservice": {$sum: "$stats.API/web service/webservice"},
          "Docker": {$sum: "$stats.Docker"},
          "Container": {$sum: "$stats.Container"},
          "Kubernetes/k8s": {$sum: "$stats.Kubernetes/k8s"},
          "Docker swarm": {$sum: "$stats.Docker swarm"},
          "AWS": {$sum: "$stats.AWS"},
          "Azure": {$sum: "$stats.Azure"},
          "Bluemix": {$sum: "$stats.Bluemix"},
          "Hadoop": {$sum: "$stats.Hadoop"},
          "HDFS": {$sum: "$stats.HDFS"},
          "HBase": {$sum: "$stats.HBase"},
          "Spark": {$sum: "$stats.Spark"},
          "MapReduce": {$sum: "$stats.MapReduce"},
          "YARN": {$sum: "$stats.YARN"},
          "Storm": {$sum: "$stats.Storm"},
          "Flink": {$sum: "$stats.Flink"},
          "Samza": {$sum: "$stats.Samza"},
          "Pig": {$sum: "$stats.Pig"},
          "Sqoop": {$sum: "$stats.Sqoop"},
          "Flume": {$sum: "$stats.Flume"},
          "LDAP": {$sum: "$stats.LDAP"},
          "Active Directory": {$sum: "$stats.Active Directory"},
          "Kerberos": {$sum: "$stats.Kerberos"},
          "PAM": {$sum: "$stats.PAM"},
          "HTML/HTML5": {$sum: "$stats.HTML/HTML5"},
          "CSS": {$sum: "$stats.CSS"},
          "XML": {$sum: "$stats.XML"},
          "JSON": {$sum: "$stats.JSON"},
          "TypeScript": {$sum: "$stats.TypeScript"},
          "CoffeScript": {$sum: "$stats.CoffeeScript"},
          "Dart": {$sum: "$stats.Dart"},
          "Rust": {$sum: "$stats.Rust"},
          "Ruby": {$sum: "$stats.Ruby"},
          "Ruby on Rails/RoR": {$sum: "$stats.Ruby on Rails/RoR"},
          "Clojure": {$sum: "$stats.Clojure"},
          "Groovy": {$sum: "$stats.Groovy"},
          "Jade": {$sum: "$stats.Jade"},
          "Lua": {$sum: "$stats.Lua"},
          "Objective-C": {$sum: "$stats.Objective-C/Objective C/ObjectiveC"},
          "Swift": {$sum: "$stats.Swift"},
          "Git": {$sum: "$stats.Git"},
          "Jira": {$sum: "$stats.Jira"},
          "SVN": {$sum: "$stats.SVN"},
          "Karma": {$sum: "$stats.Karma"},
          "Protractor": {$sum: "$stats.Protractor"},
          "Jasmine": {$sum: "$stats.Jasmine"},
          "Gulp": {$sum: "$stats.Gulp"},
          "Grunt": {$sum: "$stats.Grunt"},
          "Webpack": {$sum: "$stats.Webpack"},
          "DevOps": {$sum: "$stats.DevOps"},
          "COBOL": {$sum: "$stats.COBOL"}
        }
      }
    ], function (err, result) {
      if (err) {
        res.send(err);
      } else {
        var arr = [];
        if (Array.isArray(result) && result.length > 0) {
          result = result[0];
          delete result['_id'];
          for (var key in result) {
            if (result.hasOwnProperty(key)) {
              arr.push({name: key, value: result[key]});
            }
          }
          res.json(arr);
        } else {
          res.status(400);
          res.send({'message': 'unexpect output'});
        }
      }
    });
  });

// TODO GET count
router.route('/count')
  .get(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    query_object = {};
    var bank_name = req.query.bank;
    if (bank_name) {
      query_object.company = bank_name;
    }
    var skill = req.query.skill;
    if (skill) {
      skill = skill.replace(/\./g, '-');
      query_object['stats.' + skill] = {$gt: 0};
    }
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
    } else {
      page = 0;
    }
    var page_size = req.query.page_size;
    if (page_size) {
      page_size = parseInt(page_size);
    } else {
      page_size = 20;
    }
    var skip = page_size * page;

    Job.find(query_object)
      .sort('-post_date')
      .limit(page_size)
      .skip(skip)
      .exec(function (err, jobs) {
        if (err) {
          res.send(err);
        } else {
          Job.count(query_object, function (err, c) {
            result = {count: c, jobs: jobs};
            res.json(result);
          });
        }
      });
  });
app.use('/api', router);

app.listen(port);
