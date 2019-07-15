const knox = require('knox');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require('./secret'); // secrets.json is in .gitignore
}

const client = knox.createClient({
  key: secrets.AWS_KEY,
  secret: secrets.AWS_SECRET,
  bucket: 'imageboard-fotinichora'
});

exports.upload = function(req, res, next) {

  // console.log("i am in s3upload");
  if (!req.file) {
    res.sendStatus(500);
  }

  const s3Request = client.put(req.file.filename, {
    'Content-Type': req.file.mimetype,
    'Content-Length': req.file.size,
    'x-amz-acl': 'public-read'
  });


  const readStream = fs.createReadStream(req.file.path);
  readStream.pipe(s3Request);

  s3Request.on('err', err => {
    console.log('error from amazon its not my fault i have to sleep', err);
    next();
  })

  s3Request.on('response', s3Response => {

    const wasSuccessful = s3Response.statusCode == 200;

    // this is the url on amazon, i have now to insert in the database
    const urlOfMyFile = s3Response.req.url;
    req.s3url = urlOfMyFile;

    if (wasSuccessful) {
      next();
    } else {
      res.sendStatus(500)
    }
    // res.json({
    //   success: wasSuccessful
    // });
  });


}
