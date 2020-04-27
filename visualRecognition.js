const  VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
require("dotenv").config();

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: process.env.API_KEY
  });

module.exports=visualRecognition;