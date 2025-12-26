import jwt from "jsonwebtoken";
import User from "../../models/User.js";// corrected path

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};

export default authMiddleware;
