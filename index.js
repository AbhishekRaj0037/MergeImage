const express = require("express");
const app = express();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const mergeImg = require("merge-img");
const fs = require("fs");

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  return res.render("index");
});

async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

app.post("/post", upload.array("photos"), async (req, res) => {
  if (req.files.length !== 2) {
    return res.send("Select 2 images please");
  }
  await mergeImg([req.files[0].path, req.files[1].path]).then(async (img) => {
    img.write("out.png");
    await sleep(10);
  });
  const data = fs.readFileSync("out.png");
  res.contentType("image/png");
  return res.send(data);
});

app.listen(3000, () => {
  console.log(`Server running in port 3000`);
});
