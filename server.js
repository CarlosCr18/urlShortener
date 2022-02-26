require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
let bodyParser = require("body-parser");
const URL = require("url").URL;
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
let shorturlIndex = 0;
let shorturlArray = [];
// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post(
  "/api/shorturl",
  function (req, res, next) {
    let protocol = req.body.url.split(":")[0];
    if (protocol === "http" || protocol == "https") {
      let original_url_value = new URL(req.body.url);
      let urlObject = {
        original_url: original_url_value.href,
        short_url: shorturlIndex,
      };
      shorturlArray[shorturlIndex] = original_url_value.href;
      req.data = urlObject;
      shorturlIndex++;
      next();
    } else {
      req.data = { error: "invalid url" };
      next();
    }
  },
  (req, res) => {
    res.send(req.data);
  }
);

app.get("/api/shorturl/:id", (req, res) => {
  let short_url_value = parseInt(req.params.id);
  if (shorturlArray[short_url_value]) {
    res.redirect(shorturlArray[short_url_value]);
  } else {
    res.send({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
