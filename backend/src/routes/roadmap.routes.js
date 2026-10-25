import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import RoadmapProgress from "../models/RoadmapProgress.js";

const router = Router();

router.use(requireAuth, requireRole("student"));

function validSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// GET /api/roadmaps/:careerSlug/progress
router.get("/:careerSlug/progress", async (req, res, next) => {
    try {
        const { careerSlug } = req.params;

        if (!validSlug(careerSlug)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career slug.",
            });
        }

        const progress = await RoadmapProgress.findOne({
            user: req.user.id,
            careerSlug,
        }).lean();

        return res.json({
            success: true,
            data: {
                careerSlug,
                completedSteps: progress?.completedSteps ?? [],
            },
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/roadmaps/:careerSlug/progress
router.put("/:careerSlug/progress", async (req, res, next) => {
    try {
        const { careerSlug } = req.params;
        const { completedSteps } = req.body ?? {};

        if (!validSlug(careerSlug)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career slug.",
            });
        }

        if (
            !Array.isArray(completedSteps) ||
            completedSteps.length > 100 ||
            !completedSteps.every(
                (step) =>
                    typeof step === "string" &&
                    /^step-\d+$/.test(step)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "completedSteps must be an array of step IDs.",
            });
        }

        const uniqueSteps = [...new Set(completedSteps)];

        const progress = await RoadmapProgress.findOneAndUpdate(
            {
                user: req.user.id,
                careerSlug,
            },
            {
                $set: {
                    completedSteps: uniqueSteps,
                },
                $setOnInsert: {
                    user: req.user.id,
                    careerSlug,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.json({
            success: true,
            message: "Roadmap progress saved.",
            data: {
                careerSlug,
                completedSteps: progress.completedSteps,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
