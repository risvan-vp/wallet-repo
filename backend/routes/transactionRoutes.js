const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ============================ ADD TRANSACTION ============================ */
router.post("/add", auth, async(req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            userId: req.user._id,
            date: req.body.date ? new Date(req.body.date) : new Date(),
        });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ============================ GET ALL TRANSACTIONS ============================ */
router.get("/", auth, async(req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user._id,
        }).sort({ createdAt: -1, date: -1 });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Load failed" });
    }
});

/* ============================ UPDATE TRANSACTION ============================ */
router.put("/:id", auth, async(req, res) => {
    try {
        const updated = await Transaction.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
            amount: Number(req.body.amount),
            category: req.body.category,
            description: req.body.description,
            date: new Date(req.body.date),
        }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

/* ============================ DELETE TRANSACTION ============================ */
router.delete("/:id", auth, async(req, res) => {
    try {
        await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

/* ============================ MONTHLY TRANSACTIONS ============================ */
router.get("/monthly", auth, async(req, res) => {
    try {
        const { month, year } = req.query;

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const data = await Transaction.find({
            userId: req.user._id,
            date: { $gte: start, $lte: end },
        }).sort({ createdAt: -1, date: -1 });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Monthly load failed" });
    }
});

module.exports = router;