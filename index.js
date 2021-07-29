const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const port = 3001;
const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("land");
});
app.get("/find", (req, res) => {
    res.render("find");
});
app.get("/found", (req, res) => {
    res.render("found");
});
app.get("/detect", (req,res) => {
  res.render("detect")
})

app.listen(port, () => {
    console.log("Serving on port 3001");
});
