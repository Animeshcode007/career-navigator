import { Router } from "express";
import mongoose from "mongoose";

import { requireAuth, requireRole } from "../middleware/auth.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import {
    assessmentQuestions,
    getPublicQuestions,
} from "../data/assessmentQuestions.js";
import { validateAndScoreAnswers } from "../services/assessmentScoring.js";

const router = Router();

router.use(requireAuth, requireRole("student"));

// GET /api/assessments/questions
router.get("/questions", (req, res) => {
    return res.json({
        success: true,
        data: {
            questions: getPublicQuestions(),
            total: assessmentQuestions.length,
            categories: ["aptitude", "interests", "academic"],
        },
    });
});

// POST /api/assessments/start
router.post("/start", async (req, res, next) => {
    try {
        const questionIds = assessmentQuestions.map((question) => question.id);

        const attempt = await AssessmentAttempt.create({
            user: req.user.id,
            questionIds,
        });

        return res.status(201).json({
            success: true,
            message: "Assessment started.",
            data: {
                attemptId: attempt._id.toString(),
                status: attempt.status,
                questionIds: attempt.questionIds,
                total: attempt.questionIds.length,
                startedAt: attempt.startedAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/assessments/:attemptId
router.get("/:attemptId", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid assessment attempt ID.",
            });
        }

        const attempt = await AssessmentAttempt.findOne({
            _id: req.params.attemptId,
            user: req.user.id,
        }).lean();

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Assessment attempt not found.",
            });
        }

        const questions = getPublicQuestions().filter((question) =>
            attempt.questionIds.includes(question.id)
        );

        return res.json({
            success: true,
            data: {
                attempt: {
                    id: attempt._id.toString(),
                    status: attempt.status,
                    questions,
                    answers: attempt.answers,
                    scores: attempt.scores,
                    startedAt: attempt.startedAt,
                    submittedAt: attempt.submittedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/assessments/:attemptId/submit
router.post("/:attemptId/submit", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid assessment attempt ID.",
            });
        }

        const attempt = await AssessmentAttempt.findOne({
            _id: req.params.attemptId,
            user: req.user.id,
        });

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Assessment attempt not found.",
            });
        }

        if (attempt.status !== "in_progress") {
            return res.status(409).json({
                success: false,
                message: "This assessment has already been submitted.",
            });
        }

        let result;

        try {
            result = validateAndScoreAnswers(
                req.body?.answers,
                attempt.questionIds
            );
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid assessment answers.",
            });
        }

        attempt.answers = result.answers;
        attempt.scores = result.scores;
        attempt.status = "completed";
        attempt.submittedAt = new Date();

        await attempt.save();

        return res.json({
            success: true,
            message: "Assessment submitted successfully.",
            data: {
                attemptId: attempt._id.toString(),
                status: attempt.status,
                scores: attempt.scores,
                submittedAt: attempt.submittedAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;