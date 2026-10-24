import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.careers import CAREERS, FEATURES, FEATURE_LABELS


def student_feature_vector(scores):
    """Convert saved assessment scores into a consistent 14-feature vector."""

    if not isinstance(scores, dict):
        raise ValueError("Assessment scores are missing or invalid.")

    aptitude = scores.get("aptitude", {}).get("dimensions", {})
    interests = scores.get("interests", {})
    academic = scores.get("academic", {})

    values = {}

    for dimension in ("logical", "numerical", "verbal"):
        result = aptitude.get(dimension)

        if not isinstance(result, dict):
            raise ValueError(f"Missing aptitude score: {dimension}")

        percentage = result.get("percentage")

        if (
            not isinstance(percentage, (int, float))
            or not np.isfinite(percentage)
            or not 0 <= percentage <= 100
        ):
            raise ValueError(f"Invalid aptitude score: {dimension}")

        # Map a 0–100 percentage onto the 0–5 feature scale.
        values[dimension] = percentage / 20.0

    for dimension in (
        "realistic",
        "investigative",
        "artistic",
        "social",
        "enterprising",
        "conventional",
    ):
        result = interests.get(dimension)

        if not isinstance(result, dict):
            raise ValueError(f"Missing interest score: {dimension}")

        average = result.get("average")

        if (
            not isinstance(average, (int, float))
            or not np.isfinite(average)
            or not 1 <= average <= 5
        ):
            raise ValueError(f"Invalid interest score: {dimension}")

        values[dimension] = float(average)

    for dimension in (
        "mathematics",
        "programming",
        "science",
        "communication",
        "design",
    ):
        result = academic.get(dimension)

        if not isinstance(result, dict):
            raise ValueError(f"Missing academic score: {dimension}")

        average = result.get("average")

        if (
            not isinstance(average, (int, float))
            or not np.isfinite(average)
            or not 1 <= average <= 5
        ):
            raise ValueError(f"Invalid academic score: {dimension}")

        values[dimension] = float(average)

    return np.array(
        [values[feature] for feature in FEATURES],
        dtype=float,
    ), values


def recommend_careers(scores, limit=5):
    student_vector, student_values = student_feature_vector(scores)

    career_vectors = np.array([
        [career["features"][feature] for feature in FEATURES]
        for career in CAREERS
    ], dtype=float)

    similarities = cosine_similarity(
        student_vector.reshape(1, -1),
        career_vectors,
    )[0]

    ranked = []

    for career, similarity in zip(CAREERS, similarities):
        # This is a relative similarity score, not a success probability.
        match_score = round(float(np.clip(similarity, 0, 1)) * 100, 1)

        # Explain the recommendation using the strongest shared dimensions.
        contributions = [
            (
                student_values[feature] * career["features"][feature],
                feature,
            )
            for feature in FEATURES
        ]

        contributions.sort(reverse=True)

        reasons = [
            FEATURE_LABELS[feature]
            for _, feature in contributions[:3]
        ]

        ranked.append({
            "id": career["id"],
            "title": career["title"],
            "description": career["description"],
            "skills": career["skills"],
            "matchScore": match_score,
            "matchType": "prototype_cosine_similarity",
            "reasons": reasons,
        })

    ranked.sort(key=lambda item: item["matchScore"], reverse=True)

    return ranked[:limit]