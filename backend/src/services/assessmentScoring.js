import { assessmentQuestions } from "../data/assessmentQuestions.js";

const questionById = new Map(
    assessmentQuestions.map((question) => [question.id, question])
);

export function validateAndScoreAnswers(inputAnswers, questionIds) {
    if (!Array.isArray(inputAnswers)) {
        throw new Error("Answers must be provided as an array.");
    }

    if (inputAnswers.length !== questionIds.length) {
        throw new Error("Please answer every assessment question exactly once.");
    }

    const submitted = new Map();

    for (const item of inputAnswers) {
        if (
            !item ||
            typeof item.questionId !== "string" ||
            !Object.prototype.hasOwnProperty.call(item, "answer")
        ) {
            throw new Error("Each answer must contain questionId and answer.");
        }

        if (submitted.has(item.questionId)) {
            throw new Error("Duplicate question answers are not allowed.");
        }

        submitted.set(item.questionId, item.answer);
    }

    const expectedIds = new Set(questionIds);

    if (
        submitted.size !== expectedIds.size ||
        [...submitted.keys()].some((id) => !expectedIds.has(id))
    ) {
        throw new Error("Submitted question IDs do not match this assessment.");
    }

    const normalizedAnswers = [];
    const aptitude = {
        logical: { correct: 0, total: 0 },
        numerical: { correct: 0, total: 0 },
        verbal: { correct: 0, total: 0 },
    };

    const interestTotals = {};
    const academicTotals = {};

    for (const questionId of questionIds) {
        const question = questionById.get(questionId);

        if (!question) {
            throw new Error("Assessment contains an unknown question.");
        }

        const answer = submitted.get(questionId);

        if (question.category === "aptitude") {
            const validOption = question.options.some(
                (option) => option.id === answer
            );

            if (!validOption) {
                throw new Error(`Invalid answer for question ${questionId}.`);
            }

            const isCorrect = answer === question.correctAnswer;
            const dimension = aptitude[question.dimension];

            dimension.total += 1;
            if (isCorrect) dimension.correct += 1;

            normalizedAnswers.push({
                questionId,
                answer,
                isCorrect,
            });
            continue;
        }

        if (
            !Number.isInteger(answer) ||
            answer < 1 ||
            answer > 5
        ) {
            throw new Error(
                `Answer for question ${questionId} must be an integer from 1 to 5.`
            );
        }

        const totals =
            question.category === "interests"
                ? interestTotals
                : academicTotals;

        if (!totals[question.dimension]) {
            totals[question.dimension] = { total: 0, count: 0 };
        }

        totals[question.dimension].total += answer;
        totals[question.dimension].count += 1;

        normalizedAnswers.push({
            questionId,
            answer,
            isCorrect: null,
        });
    }

    const toPercent = (value, max) =>
        Math.round((value / max) * 100);

    const aptitudeScores = {};

    for (const [dimension, result] of Object.entries(aptitude)) {
        aptitudeScores[dimension] = {
            correct: result.correct,
            total: result.total,
            percentage: result.total
                ? toPercent(result.correct, result.total)
                : 0,
        };
    }

    const averagePercentages = Object.values(aptitudeScores)
        .map((result) => result.percentage);

    const aptitudeOverall = averagePercentages.length
        ? Math.round(
            averagePercentages.reduce((sum, score) => sum + score, 0) /
            averagePercentages.length
        )
        : 0;

    function normalizeRatings(totals) {
        return Object.fromEntries(
            Object.entries(totals).map(([dimension, result]) => {
                const average = result.total / result.count;

                return [
                    dimension,
                    {
                        average: Math.round(average * 100) / 100,
                        percentage: toPercent(average, 5),
                    },
                ];
            })
        );
    }

    return {
        answers: normalizedAnswers,
        scores: {
            aptitude: {
                overallPercentage: aptitudeOverall,
                dimensions: aptitudeScores,
            },
            interests: normalizeRatings(interestTotals),
            academic: normalizeRatings(academicTotals),
            scoringVersion: 1,
        },
    };
}