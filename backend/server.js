const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();


app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use(cors());

/* routes */
const authRoutes = require("./routes/auth");
const annotationRoutes = require("./routes/annotations");
const imageRoutes = require("./routes/images");

app.use("/auth", authRoutes);
app.use("/annotations", annotationRoutes);
app.use("/images", imageRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = app;