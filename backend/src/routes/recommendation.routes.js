import { Router } from "express";

import { requireAuth, requireRole } from "../middleware/auth.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";

const router = Router();

router.use(requireAuth, requireRole("student"));

// GET /api/recommendations/current
router.get("/current", async (req, res, next) => {
    try {
        const attempt = await AssessmentAttempt.findOne({
            user: req.user.id,
            status: "completed",
        })
            .sort({ submittedAt: -1 })
            .select("scores submittedAt");

        if (!attempt || !attempt.scores) {
            return res.status(404).json({
                success: false,
                message: "Complete an assessment before requesting recommendations.",
            });
        }

        const mlServiceUrl =
            process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

        let mlResponse;

        try {
            mlResponse = await fetch(`${mlServiceUrl}/api/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scores: attempt.scores,
                }),
                signal: AbortSignal.timeout(5000),
            });
        } catch {
            return res.status(503).json({
                success: false,
                message: "The recommendation service is temporarily unavailable.",
            });
        }

        if (!mlResponse.ok) {
            console.error(
                "ML service returned HTTP status:",
                mlResponse.status
            );

            return res.status(502).json({
                success: false,
                message: "Could not generate recommendations.",
            });
        }

        const result = await mlResponse.json();

        if (!result.success || !Array.isArray(result.data?.recommendations)) {
            return res.status(502).json({
                success: false,
                message: "The recommendation service returned an invalid response.",
            });
        }

        return res.json({
            success: true,
            data: {
                assessmentSubmittedAt: attempt.submittedAt,
                ...result.data,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;