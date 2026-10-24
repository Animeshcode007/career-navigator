import { Router } from "express";
import { getDatabaseStatus } from "../config/db.js";

const router = Router();

router.get("/", (req, res) => {
    const database = getDatabaseStatus();
    const healthy = database.connected;

    res.status(healthy ? 200 : 503).json({
        success: healthy,
        message: healthy
            ? "Career Navigator API is running."
            : "API is running, but the database is not connected.",
        data: {
            api: "ok",
            database: database.state,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
        },
    });
});

export default router;
