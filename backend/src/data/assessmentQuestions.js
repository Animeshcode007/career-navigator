const aptitudeQuestions = [
    {
        id: "apt-log-01",
        category: "aptitude",
        dimension: "logical",
        type: "single_choice",
        question: "What number comes next: 2, 4, 8, 16, ...?",
        options: [
            { id: "a", text: "18" },
            { id: "b", text: "24" },
            { id: "c", text: "32" },
            { id: "d", text: "36" },
        ],
        correctAnswer: "c",
    },
    {
        id: "apt-log-02",
        category: "aptitude",
        dimension: "logical",
        type: "single_choice",
        question: "All engineers are problem-solvers. Riya is an engineer. Which conclusion follows?",
        options: [
            { id: "a", text: "Riya is a problem-solver" },
            { id: "b", text: "All problem-solvers are engineers" },
            { id: "c", text: "Riya is not a problem-solver" },
            { id: "d", text: "No conclusion follows" },
        ],
        correctAnswer: "a",
    },
    {
        id: "apt-num-01",
        category: "aptitude",
        dimension: "numerical",
        type: "single_choice",
        question: "What is 15% of 200?",
        options: [
            { id: "a", text: "15" },
            { id: "b", text: "20" },
            { id: "c", text: "30" },
            { id: "d", text: "35" },
        ],
        correctAnswer: "c",
    },
    {
        id: "apt-num-02",
        category: "aptitude",
        dimension: "numerical",
        type: "single_choice",
        question: "A car travels 120 km in 2 hours. What is its average speed?",
        options: [
            { id: "a", text: "40 km/h" },
            { id: "b", text: "50 km/h" },
            { id: "c", text: "60 km/h" },
            { id: "d", text: "80 km/h" },
        ],
        correctAnswer: "c",
    },
    {
        id: "apt-ver-01",
        category: "aptitude",
        dimension: "verbal",
        type: "single_choice",
        question: "Choose the closest meaning of 'concise'.",
        options: [
            { id: "a", text: "Brief and clear" },
            { id: "b", text: "Confusing" },
            { id: "c", text: "Very lengthy" },
            { id: "d", text: "Unrelated" },
        ],
        correctAnswer: "a",
    },
    {
        id: "apt-ver-02",
        category: "aptitude",
        dimension: "verbal",
        type: "single_choice",
        question: "Choose the grammatically correct sentence.",
        options: [
            { id: "a", text: "She have completed the task." },
            { id: "b", text: "She has completed the task." },
            { id: "c", text: "She completing the task." },
            { id: "d", text: "She were completed the task." },
        ],
        correctAnswer: "b",
    },
];

const interestQuestions = [
    {
        id: "int-real-01",
        category: "interests",
        dimension: "realistic",
        question: "I enjoy building, repairing, or working with physical objects.",
    },
    {
        id: "int-inv-01",
        category: "interests",
        dimension: "investigative",
        question: "I enjoy analyzing data and solving complex problems.",
    },
    {
        id: "int-art-01",
        category: "interests",
        dimension: "artistic",
        question: "I enjoy creative activities such as designing, writing, or creating visuals.",
    },
    {
        id: "int-soc-01",
        category: "interests",
        dimension: "social",
        question: "I enjoy teaching, mentoring, or helping other people learn.",
    },
    {
        id: "int-ent-01",
        category: "interests",
        dimension: "enterprising",
        question: "I enjoy leading a team, persuading people, or organizing initiatives.",
    },
    {
        id: "int-con-01",
        category: "interests",
        dimension: "conventional",
        question: "I enjoy organizing information, following processes, and maintaining accurate records.",
    },
];

const academicQuestions = [
    {
        id: "aca-math-01",
        category: "academic",
        dimension: "mathematics",
        question: "How confident are you with mathematics and quantitative problems?",
    },
    {
        id: "aca-com-01",
        category: "academic",
        dimension: "programming",
        question: "How confident are you with programming and computational thinking?",
    },
    {
        id: "aca-sci-01",
        category: "academic",
        dimension: "science",
        question: "How confident are you with scientific concepts and experimentation?",
    },
    {
        id: "aca-com-02",
        category: "academic",
        dimension: "communication",
        question: "How confident are you in explaining ideas clearly in writing or speech?",
    },
    {
        id: "aca-des-01",
        category: "academic",
        dimension: "design",
        question: "How confident are you with visual design and creative problem-solving?",
    },
];

export const assessmentQuestions = [
    ...aptitudeQuestions,
    ...interestQuestions,
    ...academicQuestions,
];

export function getPublicQuestions() {
    return assessmentQuestions.map((question) => {
        const { correctAnswer, ...publicQuestion } = question;

        if (publicQuestion.category === "interests" ||
            publicQuestion.category === "academic") {
            return {
                ...publicQuestion,
                type: "rating",
                scale: {
                    min: 1,
                    max: 5,
                    labels: [
                        "Very low",
                        "Low",
                        "Moderate",
                        "High",
                        "Very high",
                    ],
                },
            };
        }

        return publicQuestion;
    });
}