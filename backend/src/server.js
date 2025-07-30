import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notifications.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";
import serverless from "serverless-http";

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello from the server!"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Connect to DB and start server if not in production
const startServer = async () => {
  try {
    await connectDB();

    if (ENV.NODE_ENV !== "production") {
      const PORT = ENV.PORT || 5000;
      app.listen(PORT, () =>
        console.log("Server is running on PORT:", PORT)
      );
    }
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
};

await startServer(); // Always runs — handles both local and Vercel needs

// Export handler for Vercel serverless deployment
export const handler = serverless(app);
