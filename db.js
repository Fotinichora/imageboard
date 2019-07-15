var spicedPg = require('spiced-pg');
var db = spicedPg(
  process.env.DATABASE_URL ||
  'postgres:postgres@localhost:5432/postgres');

module.exports.getImages = function getImages() {
  return db.query(`SELECT * FROM images`);
};


module.exports.insertImage = function insertImage(
  username,
  title,
  description,
  amazonURL
) {
  return db.query(
    "INSERT INTO images (url, username, title, description) VALUES ($1,$2,$3,$4) RETURNING * ",
    [amazonURL, username, title, description]
  );
};

module.exports.getComments = function getComments(
  image_id
) {
  return db.query("SELECT * FROM comments WHERE image_id = $1",
    [image_id])
}


module.exports.addComment = function addComment(
  username,
  comment,
  image_id
) {
  return db.query("INSERT INTO comments(username,comment,image_id) VALUES ($1,$2,$3)",
    [username, comment, image_id])
}


module.exports.getImagebyid = function getImagebyid(
  image_id,
) {
  return db.query("SELECT * FROM images WHERE id=$1", [image_id])
}






// first step to continue is to create a module getimagebyid,
// sec step create a root to take one image
// create and fix my template
