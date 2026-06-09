const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   GET CATEGORIES
========================= */
router.get("/", auth, async(req, res) => {
    try {
        const categories = await Category.find({
            userId: req.user._id,
        });

        res.json(categories);
    } catch (err) {
        console.error("GET CATEGORIES ERROR:", err);
        res.status(500).json({ message: "Failed to load categories" });
    }
});

/* =========================
   ADD CATEGORY
========================= */
router.post("/add", auth, async(req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "Name and type are required",
            });
        }

        const category = await Category.create({
            userId: req.user._id,
            name,
            type,
        });

        res.json(category);
    } catch (err) {
        console.error("ADD CATEGORY ERROR:", err);
        res.status(500).json({ message: "Failed to add category" });
    }
});

/* =========================
   UPDATE CATEGORY
========================= */
router.put("/:id", auth, async(req, res) => {
    try {
        const { name, type } = req.body;

        const category = await Category.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { name, type }, { new: true });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category);
    } catch (err) {
        console.error("UPDATE CATEGORY ERROR:", err);
        res.status(500).json({ message: "Failed to update category" });
    }
});

/* =========================
   DELETE CATEGORY
========================= */
router.delete("/:id", auth, async(req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted" });
    } catch (err) {
        console.error("DELETE CATEGORY ERROR:", err);
        res.status(500).json({ message: "Failed to delete category" });
    }
});

module.exports = router;