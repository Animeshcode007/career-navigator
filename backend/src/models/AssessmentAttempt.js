import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: String,
            required: true,
        },
        answer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            default: null,
        },
    },
    { _id: false }
);

const assessmentAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["in_progress", "completed"],
            default: "in_progress",
            index: true,
        },

        questionIds: {
            type: [String],
            required: true,
        },

        answers: {
            type: [answerSchema],
            default: [],
        },

        scores: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        submittedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

assessmentAttemptSchema.index({ user: 1, createdAt: -1 });

const AssessmentAttempt = mongoose.model(
    "AssessmentAttempt",
    assessmentAttemptSchema
);

export default AssessmentAttempt;