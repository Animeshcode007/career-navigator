import mongoose from "mongoose";

const roadmapProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        careerSlug: {
            type: String,
            required: true,
            trim: true,
        },
        completedSteps: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

roadmapProgressSchema.index(
    { user: 1, careerSlug: 1 },
    { unique: true }
);

const RoadmapProgress = mongoose.model(
    "RoadmapProgress",
    roadmapProgressSchema
);

export default RoadmapProgress;
