import { getAuth } from "@clerk/express";

export const protectRoute = (req, res, next) => {
  const { userId } = getAuth(req); // ✅ safe and official
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - You must be logged in." });
  }
  req.userId = userId; // you can attach this for use in controllers
  next();
};
