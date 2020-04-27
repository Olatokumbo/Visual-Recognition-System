const visualRecognition = require("./visualRecognition");
const  fs = require('fs');
const path = require("path");
var express = require('express');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+".jpg")
    }
});
var upload = multer({storage: storage});
 
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));


// var url= 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSAj_PoSr07-x9MO1jkx5OGA6pDAa6RzaP3_XU91g0qfivpqcE3';

app.get("/", function(req, res){

res.render("index");
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {

    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    var params = {
        threshold: 0.518,
        images_file: fs.createReadStream(file.path)
    };
    //   res.send(file); 
    // console.log(fs.createReadStream(file.path).path);
      visualRecognition.classify(params, function(err, response) {
  if (err) {
    console.log(err);
  } else {
      var jsson=JSON.parse(JSON.stringify(response, null, 2));
    console.log(jsson.images[0].classifiers[0].classes);
    // for(i=0;i<jsson.images[0].classifiers[0].classes.length;i++){
    //   console.log(jsson.images[0].classifiers[0].classes[i].class);
    //   console.log(jsson.images[0].classifiers[0].classes[i].score);
    // }
    // res.send(JSON.stringify(response, null, 2));
    var paths=String(fs.createReadStream(file.path).path); 
    var result = paths.slice(6, 39);
    // console.log("Data "+result)
    res.render("output", {data: jsson.images[0].classifiers[0].classes, path: result});
  }
});
  });

app.listen(8000, function(req, res){
console.log("Listening at port 8000");
});
