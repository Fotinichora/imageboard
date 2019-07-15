// this is our server
const express = require('express');
const app = express();
const db = require('./db');
const s3 = require('./s3');

app.use(express.static('./public'));
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
  // console.log('req.file', req.file);
  // console.log('req.body', req.body);

  const dbpromise = db.insertImage(

    req.body.username,
    req.body.title,
    req.body.description,
    req.s3url

  ).then(results => {
    res.json(results.rows);
  }).catch(dafuck => {
    console.log(dafuck)
    res.json({
      success: false,
    });
  });


});




app.get('/get-images', (req, res) => {
  // console.log('GET /get-images hit!!', images);

  db.getImages()
    .then(results => {
      res.json(results.rows);
    })
    .catch(error => {
      console.log(error);
    });
});


//root to see my image after click
app.get('/images/:image_id', (req, res) => {
  var image_id = req.params.image_id;
  // console.log("id:", image_id);

  db.getImagebyid(image_id)
    .then(results => {
      // console.log("results one image:", results.rows);
      res.json(results.rows[0]);
    })
    .catch(error => {
      console.log(error);
    });
});




// app.get('/currentImageimages:id', (req, res) => {
//   // console.log('GET /get-images hit!!', images);
//
//   db.getImages()
//     .then(results => {
//       res.json(results.rows);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });


//i have to create a new app.get for images

// i add a comment
app.post('/comments', (req, res) => {
  db.addComment(req.body.username, req.body.comment, req.body.image_id)
    .then(results => {
      res.json(results.rows);
    })
    .catch(error => {
      console.log(error);
    });
})

// needs to get called from Vue.js axios with a query string comments?image_id=5
app.get('/comments/:image_id', (req, res) => {
  var image_id = req.params.image_id;
  db.getComments(image_id).then(results => {
      res.json(results.rows);
    })
    .catch(error => {
      console.log(error);
    });
});



app.listen(8080, () => console.log('Listening!'));
