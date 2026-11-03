"""
Customers API Route handlers.
"""
from flask import Blueprint, jsonify, request
from models import db, Customer

customers_bp = Blueprint("customers", __name__, url_prefix="/customers")


@customers_bp.route("", methods=["GET"])
@customers_bp.route("/", methods=["GET"])
def list_customers():
    customers = Customer.query.order_by(Customer.created_at.desc()).all()
    return jsonify(
        {
            "success": True,
            "count": len(customers),
            "data": [cust.to_dict() for cust in customers],
        }
    )


@customers_bp.route("", methods=["POST"])
@customers_bp.route("/", methods=["POST"])
def create_customer():
    data = request.get_json() or {}
    required = ["first_name", "last_name", "email"]
    for field in required:
        if field not in data:
            return jsonify({"success": False, "message": f"Missing required field: {field}"}), 400

    existing = Customer.query.filter_by(email=data["email"]).first()
    if existing:
        return jsonify({"success": False, "message": "Customer with this email already exists"}), 409

    address = data.get("address", {})
    customer = Customer(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        phone=data.get("phone"),
        address_line1=address.get("line1") or data.get("address_line1"),
        address_line2=address.get("line2") or data.get("address_line2"),
        city=address.get("city") or data.get("city"),
        state=address.get("state") or data.get("state"),
        postal_code=address.get("postal_code") or data.get("postal_code"),
        country=address.get("country") or data.get("country", "India"),
    )
    db.session.add(customer)
    db.session.commit()

    return jsonify({"success": True, "message": "Customer created successfully", "data": customer.to_dict()}), 201
