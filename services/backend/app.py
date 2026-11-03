"""
Flask Application Entry Point
Traditional Fashion & Beauty Store Microservice Backend
"""
import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from routes.health import health_bp
from routes.categories import categories_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.customers import customers_bp
from routes.cart import cart_bp

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("backend-api")


def create_app():
    app = Flask(__name__)

    # Enable Cross-Origin Resource Sharing
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Database Configuration
    db_user = os.getenv("DB_USER", "ecommerce_user")
    db_pass = os.getenv("DB_PASSWORD", "securepassword123")
    db_host = os.getenv("DB_HOST", "database")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "ecommerce_db")

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        database_url = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(cart_bp)

    @app.route("/", methods=["GET"])
    def index():
        return jsonify(
            {
                "service": "Traditional Fashion & Beauty Store API",
                "status": "online",
                "version": "1.0.0",
                "documentation": {
                    "health": "/health",
                    "categories": "/categories",
                    "products": "/products",
                    "orders": "/orders",
                    "customers": "/customers",
                    "cart": "/cart",
                },
            }
        )

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f"Internal server error: {e}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables verified.")
        except Exception as exc:
            logger.warning(f"Database table verification deferred: {exc}")

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
