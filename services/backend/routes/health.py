"""
Health check endpoints for container and Kubernetes / ECS liveness probes.
"""
from datetime import datetime
from flask import Blueprint, jsonify
from sqlalchemy import text
from models import db

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    db_status = "healthy"
    try:
        db.session.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"

    status_code = 200 if db_status == "healthy" else 503
    return (
        jsonify(
            {
                "status": "UP" if db_status == "healthy" else "DOWN",
                "service": "ecommerce-backend-api",
                "version": "1.0.0",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "components": {
                    "database": {
                        "status": db_status,
                        "type": "PostgreSQL",
                    }
                },
            }
        ),
        status_code,
    )
