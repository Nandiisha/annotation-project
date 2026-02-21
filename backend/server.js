const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* allow Vercel frontend */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

const authRoutes = require("./routes/auth");
const annotationRoutes = require("./routes/annotations");
const imageRoutes = require("./routes/images");

app.use("/api/auth", authRoutes);
app.use("/api/annotations", annotationRoutes);
app.use("/api/images", imageRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});