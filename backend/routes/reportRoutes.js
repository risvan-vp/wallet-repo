const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =============================
   RANGE REPORT (DAILY / MONTHLY / YEARLY)
============================= */
router.get("/range", auth, async(req, res) => {
    try {
        const { start, end } = req.query;

        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        const match = {
            userId: new mongoose.Types.ObjectId(req.user._id),
            date: { $gte: startDate, $lte: endDate },
        };

        /* DAILY */
        const daily = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        /* CATEGORY */
        const category = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { category: "$category", type: "$type" },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { total: -1 } },
        ]);

        /* WEEKLY */
        const weekly = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $isoWeek: "$date" },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        /* YEARLY */
        const yearly = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $year: "$date" },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ daily, weekly, category, yearly });
    } catch (err) {
        console.error("REPORT ERROR:", err);
        res.status(500).json({ message: "Report generation failed" });
    }
});

module.exports = router;