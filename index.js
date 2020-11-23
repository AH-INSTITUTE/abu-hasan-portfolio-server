const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fieUpload = require("express-fileupload");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
//mongo DB info
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ubnkj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fieUpload());

// const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("ABU HASAN");
});

// Connecting to database
client.connect((err) => {
  console.log("DataBase Connection Successful");

  // admin details collection processes
  const adminC = client.db(process.env.DB_NAME).collection(process.env.ADMIN_EMAIL);
  app.get("/getAdmin", (req, res) => {
    adminC.find({}).toArray((err, docs) => {
      if (docs.length) {
        res.status(200).send(docs);
      } else {
        res.sendStatus(400);
      }
    });
  });

  // // Project collection
  const projectData = client
    .db(process.env.DB_NAME)
    .collection(process.env.BD_PROJECT);
  app.post("/addProject", (req, res) => {
    projectData.insertOne(req.body).then((result) => {
      if (result.insertedCount > 0) {
        res.status(200).send(result.insertedCount > 0);
      } else {
        result.sendStatus(400);
      }
    });
  });
  app.get("/getProjects", (req, res) => {
    const filterObject = {};
    req.query.status && (filterObject.status = req.query.status);
    req.query.category && (filterObject.category = req.query.category);
    projectData.find(filterObject).toArray((err, projects) => {
      if (projects.length) {
        res.status(200).send(projects);
      } else {
        res.sendStatus(404);
      }
    });
  });

  // Blogs collection
  const blogsCT = client.db(process.env.DB_NAME).collection(process.env.BD_BLOG);
  app.post("/addBlog", (req, res) => {
    blogsCT.insertOne(req.body).then((result) => {
      if (result.insertedCount > 0) {
        res.status(200).send(result.insertedCount > 0);
      } else {
        res.sendStatus(404);
      }
    });
  });
  app.get("/getBlogs", (req, res) => {
    const filterObject = {};
    req.query.field && (filterObject.field = req.query.field);
    blogsCT.find(filterObject).toArray((err, projects) => {
      if (projects.length) {
        res.status(200).send(projects);
      } else {
        res.sendStatus(404);
      }
    });
  });

  //skill collection
  const skillCT = client.db(process.env.DB_NAME).collection(process.env.BD_Skill);
  app.post("/addSkill", (req, res) => {
    skillCT.insertOne(req.body).then((result) => {
      if (result.insertedCount > 0) {
        res.status(200).send(result.insertedCount > 0);
      } else {
        res.sendStatus(404);
      }
    });
  });
  app.get("/getSkill", (req, res) => {
    const filterObject = {};
    req.query.typeOf && (filterObject.typeOf = req.query.typeOf);
    skillCT.find(filterObject).toArray((err, projects) => {
      if (projects.length) {
        res.status(200).send(projects);
      } else {
        res.sendStatus(404);
      }
    });
  });
});

app.listen(process.env.PORT);


