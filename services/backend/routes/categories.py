"""
Categories API Route handlers.
"""
from flask import Blueprint, jsonify
from models import Category

categories_bp = Blueprint("categories", __name__, url_prefix="/categories")


@categories_bp.route("", methods=["GET"])
@categories_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.order_by(Category.id.asc()).all()
    return jsonify(
        {
            "success": True,
            "count": len(categories),
            "data": [cat.to_dict() for cat in categories],
        }
    )
