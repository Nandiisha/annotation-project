const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

/* ================= SAVE IMAGE ================= */
router.post("/", auth, async (req, res) => {
  try {
    const { image_data, image_name } = req.body;

    if (!image_data) {
      return res.status(400).json({ message: "No image data" });
    }

    const result = await db.query(
      `INSERT INTO images (image_data, image_name, user_id)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [image_data, image_name, req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("IMAGE SAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET IMAGES ================= */
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM images
       WHERE user_id=$1
       ORDER BY id DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.log("FETCH IMAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE IMAGE ================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM images WHERE id=$1 AND user_id=$2`,
      [req.params.id, req.user.id]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    console.log("DELETE IMAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;