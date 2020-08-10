const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
const tesseract = require("node-tesseract-ocr")

//middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const PORT = process.env.PORT | 5000;

var Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + '/images');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).single('image');
//route
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', (req, res) => {
  console.log(req.file);
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  } // the tesseract options
  upload(req, res, err => {
    if (err) {
      console.log(err);
      return res.send('Something went wrong');
    }
    var imgPath = __dirname + '/images/' + req.file.originalname;
    var image = fs.readFileSync(
      imgPath,
      {
        encoding: null
      }
    );
    tesseract.recognize(imgPath, config)
      .then(text => {
        console.log("Result:", text)
        res.send(text);
      })
      .catch(error => {
        console.log(error.message)
      })
  });
});

app.get('/showdata', (req, res) => { });

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
