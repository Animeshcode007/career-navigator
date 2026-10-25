import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN =
    process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");

app.use(helmet());

app.use(
    cors({
        origin: CLIENT_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Career Navigator API.",
        healthCheck: "/api/health",
    });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/roadmaps", roadmapRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled request error:", err.message);

    res.status(err.status || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "An unexpected server error occurred."
                : err.message,
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Career Navigator API: http://localhost:${PORT}`);
            console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error("Server startup aborted because setup failed.");
        process.exit(1);
    }
}

startServer();
