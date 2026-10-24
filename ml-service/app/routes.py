from flask import Blueprint, jsonify, request

from app.careers import CAREERS
from app.recommender import recommend_careers

api = Blueprint("api", __name__)


@api.get("/health")
def health():
    return jsonify({
        "success": True,
        "service": "career-navigator-ml",
        "status": "ok",
    })


@api.get("/careers")
def careers():
    return jsonify({
        "success": True,
        "data": [
            {
                "id": career["id"],
                "title": career["title"],
                "description": career["description"],
                "skills": career["skills"],
            }
            for career in CAREERS
        ],
    })


@api.post("/recommend")
def recommend():
    body = request.get_json(silent=True)

    if not isinstance(body, dict) or not isinstance(body.get("scores"), dict):
        return jsonify({
            "success": False,
            "message": "A valid assessment scores object is required.",
        }), 400

    try:
        recommendations = recommend_careers(body["scores"], limit=5)
    except (ValueError, TypeError, KeyError) as error:
        return jsonify({
            "success": False,
            "message": str(error),
        }), 400

    return jsonify({
        "success": True,
        "data": {
            "recommendations": recommendations,
            "count": len(recommendations),
            "method": "cosine_similarity",
            "notice": (
                "Prototype matches based on illustrative career profiles; "
                "not validated predictions of career success."
            ),
        },
    })