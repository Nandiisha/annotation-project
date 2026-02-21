const express = require("express");
console.log("IMAGES ROUTE LOADED");

const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

/* ================= POST IMAGE ================= */
router.post("/", auth, async (req, res) => {
  try {
    // 🔥 match frontend
    const { image_data, image_name } = req.body;

    if (!image_data) {
      return res.status(400).json({ message: "No image data" });
    }

    // check duplicate
    const existing = await pool.query(
      "SELECT * FROM images WHERE image_name=$1 AND user_id=$2",
      [image_name, req.user.id]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO images (image_data, image_name, user_id) VALUES ($1,$2,$3) RETURNING *",
      [image_data, image_name, req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("IMAGE POST ERROR:", err);
    res.status(500).json({ message: "Server error" }); // 🔥 JSON not send()
  }
});

/* ================= GET IMAGES ================= */
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM images WHERE user_id=$1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.log("IMAGE GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE IMAGE ================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM annotations WHERE image_id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    await pool.query(
      "DELETE FROM images WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.log("IMAGE DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;