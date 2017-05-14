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
//         total_java: { $sum: "$stats.Java"},
//         total_Agile: {$sum: "$stats.Agile"}
//       }
//    } ])
router.route('/stats')
  .get(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var body = req.body;
    var match = {};
    if (body && body.company) {
      match = {"company": body.company};
    }
    Job.aggregate([
      {
        "$match": match
      },
      {
        "$group": {
          "_id": null,
          "total_java": {$sum: "$stats.Java"},
          "total_agile": {$sum: "$stats.Agile"},
          "total_Linux/Unix": {$sum: "$stats.Linux/Unix"},
          "total_AIX": {$sum: "$stats.AIX"},
          "total_Windows": {$sum: "$stats.Windows"},
          "total_Tomcat": {$sum: "$stats.Tomcat"},
          "total_Websphere": {$sum: "$stats.Websphere"},
          "total_Weblogic": {$sum: "$stats.Weblogic"},
          "total_Nginx": {$sum: "$stats.Nginx"},
          "total_Jboss": {$sum: "$stats.Jboss"},
          "total_IIS": {$sum: "$stats.IIS"},
          "total_Zookeeper": {$sum: "$stats.Zookeeper"},
          "total_Kafka": {$sum: "$stats.Kafka"},
          "total_DB/Database/Databases/DBMS": {$sum: "$stats.DB/Database/Databases/DBMS"},
          "total_MySQL": {$sum: "$stats.MySQL"},
          "total_DB2": {$sum: "$stats.DB2"},
          "total_Oracle": {$sum: "$stats.Oracle"},
          "total_Netezza": {$sum: "$stats.Netezza"},
          "total_Postgres": {$sum: "$stats.Postgres"},
          "total_Redis": {$sum: "$stats.Redis"},
          "total_Memchached": {$sum: "$stats.Memcached"},
          "total_Hive": {$sum: "$stats.Hive"},
          "total_Cassandra": {$sum: "$stats.Cassandra"},
          "total_DynamoDB": {$sum: "$stats.DynamoDB"},
          "total_SimpleDB": {$sum: "$stats.SimpleDB"},
          "total_Elasticsearch": {$sum: "$stats.Elasticsearch"},
          "total_Firebase": {$sum: "$stats.Firebase"},
          "total_FoundationDB": {$sum: "$stats.FoundationDB"},
          "total_Lucene": {$sum: "$stats.Lucene"},
          "total_MariaDB": {$sum: "$stats.MariaDB"},
          "total_Neo4j": {$sum: "$stats.Neo4j"},
          "total_SQLite": {$sum: "$stats.SQLite"},
          "total_SQLserver/SQL server": {$sum: "$stats.SQLserver/SQL server"},
          "total_NoSQL": {$sum: "$stats.NoSQL"},
          "total_MongoDB": {$sum: "$stats.MongoDB"},
          "total_CouchDB": {$sum: "$stats.CouchDB"},
          "total_Perl": {$sum: "$stats.Perl"},
          "total_Bash/Shell": {$sum: "$stats.Bash/Shell"},
          "total_Erlang": {$sum: "$stats.Erlang"},
          "total_Golang/Google Go": {$sum: "$stats.Golang/Google Go"},
          "total_PHP": {$sum: "$stats.PHP"},
          "total_Smalltalk": {$sum: "$stats.Smalltalk"},
          "total_Java": {$sum: "$stats.Java"},
          "total_JaveEE/Jave EE/J2EE": {$sum: "$stats.JavaEE/Java EE/J2EE"},
          "total_Spring": {$sum: "$stats.Spring"},
          "total_Structs": {$sum: "$stats.Structs"},
          "total_Hibernate": {$sum: "$stats.Hibernate"},
          "total_Maven": {$sum: "$stats.Maven"},
          "total_Gradle": {$sum: "$stats.Gradle"},
          "total_JDBC": {$sum: "$stats.JDBC"},
          "total_Solr": {$sum: "$stats.Solr"},
          "total_Android": {$sum: "$stats.Android"},
          "total_iOS": {$sum: "$stats.iOS"},
          "total_Net": {$sum: "$stats.-Net/ASP-NET"},
          "total_C#": {$sum: "$stats.C#"},
          "total_Xamarin": {$sum: "$stats.Xarmarin"},
          "total_C": {$sum: "$stats.C"},
          "total_C++": {$sum: "$stats.C++"},
          "total_nodejs": {$sum: "$stats.Node-js/nodejs"},
          "total_Javascript/Java script/JS": {$sum: "$stats.Javascript/Java script/JS"},
          "total_Angular": {$sum: "$stats.Angular"},
          "total_react": {$sum: "$stats.react"},
          "total_Expressjs": {$sum: "$stats.Express-js/Expressjs"},
          "total_Bootstrap": {$sum: "$stats.Bootstrap"},
          "total_Python": {$sum: "$stats.Python"},
          "total_TensorFlow": {$sum: "$stats.TensorFlow"},
          "total_Scikit-learn/Scikit learn": {$sum: "$stats.Scikit-learn/Scikit learn"},
          "total_Django": {$sum: "$stats.Django"},
          "total_Machine learning": {$sum: "$stats.Machine learning"},
          "total_Jenkins": {$sum: "$stats.Jenkins"},
          "total_Travis": {$sum: "$stats.Travis/travis-ci"},
          "total_Selenium": {$sum: "$stats.Selenium"},
          "total_UrbanCode Deploy/UCD": {$sum: "$stats.UrbanCode Deploy/UCD"},
          "total_Chef": {$sum: "$stats.Chef"},
          "total_Ansible": {$sum: "$stats.Ansible"},
          "total_Cloud": {$sum: "$stats.Cloud"},
          "total_REST/Restful": {$sum: "$stats.REST/Restful"},
          "total_SOAP": {$sum: "$stats.SOAP"},
          "total_API/web service/webservice": {$sum: "$stats.API/web service/webservice"},
          "total_Docker": {$sum: "$stats.Docker"},
          "total_Container": {$sum: "$stats.Container"},
          "total_Kubernetes/k8s": {$sum: "$stats.Kubernetes/k8s"},
          "total_Docker swarm": {$sum: "$stats.Docker swarm"},
          "total_AWS": {$sum: "$stats.AWS"},
          "total_Azure": {$sum: "$stats.Azure"},
          "total_Bluemix": {$sum: "$stats.Bluemix"},
          "total_Hadoop": {$sum: "$stats.Hadoop"},
          "total_HDFS": {$sum: "$stats.HDFS"},
          "total_HBase": {$sum: "$stats.HBase"},
          "total_Spark": {$sum: "$stats.Spark"},
          "total_MapReduce": {$sum: "$stats.MapReduce"},
          "total_YARN": {$sum: "$stats.YARN"},
          "total_Storm": {$sum: "$stats.Storm"},
          "total_Flink": {$sum: "$stats.Flink"},
          "total_Samza": {$sum: "$stats.Samza"},
          "total_Pig": {$sum: "$stats.Pig"},
          "total_Sqoop": {$sum: "$stats.Sqoop"},
          "total_Flume": {$sum: "$stats.Flume"},
          "total_LDAP": {$sum: "$stats.LDAP"},
          "total_Active Directory": {$sum: "$stats.Active Directory"},
          "total_Kerberos": {$sum: "$stats.Kerberos"},
          "total_PAM": {$sum: "$stats.PAM"},
          "total_HTML/HTML5": {$sum: "$stats.HTML/HTML5"},
          "total_CSS": {$sum: "$stats.CSS"},
          "total_XML": {$sum: "$stats.XML"},
          "total_JSON": {$sum: "$stats.JSON"},
          "total_TypeScript": {$sum: "$stats.TypeScript"},
          "total_CoffeScript": {$sum: "$stats.CoffeeScript"},
          "total_Dart": {$sum: "$stats.Dart"},
          "total_Rust": {$sum: "$stats.Rust"},
          "total_Ruby": {$sum: "$stats.Ruby"},
          "total_Ruby on Rails/RoR": {$sum: "$stats.Ruby on Rails/RoR"},
          "total_Clojure": {$sum: "$stats.Clojure"},
          "total_Groovy": {$sum: "$stats.Groovy"},
          "total_Jade": {$sum: "$stats.Jade"},
          "total_Lua": {$sum: "$stats.Lua"},
          "total_Objective-C": {$sum: "$stats.Objective-C/Objective C/ObjectiveC"},
          "total_Swift": {$sum: "$stats.Swift"},
          "total_Git": {$sum: "$stats.Git"},
          "total_Jira": {$sum: "$stats.Jira"},
          "total_SVN": {$sum: "$stats.SVN"},
          "total_Karma": {$sum: "$stats.Karma"},
          "total_Protractor": {$sum: "$stats.Protractor"},
          "total_Jasmine": {$sum: "$stats.Jasmine"},
          "total_Gulp": {$sum: "$stats.Gulp"},
          "total_Grunt": {$sum: "$stats.Grunt"},
          "total_Webpack": {$sum: "$stats.Webpack"},
          "total_DevOps": {$sum: "$stats.DevOps"},
          "total_COBOL": {$sum: "$stats.COBOL"}
        }
      }
    ], function (err, result) {
      if (err) {
        res.send(err);
      } else {
        var arr = [];
        if(Array.isArray(result) && result.length > 0) {
          result = result[0];
          delete result['_id'];
          for (var key in result) {
            if (result.hasOwnProperty(key)) {
              console.log('=====');
              console.log(key);
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

app.use('/api', router);

app.listen(port);
