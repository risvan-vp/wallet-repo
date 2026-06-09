const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.id }; // 🔴 MUST be _id
        next();
    } catch (err) {
        console.error("AUTH ERROR:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};