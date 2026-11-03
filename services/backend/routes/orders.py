"""
Orders API Route handlers.
"""
from datetime import datetime
import uuid
from flask import Blueprint, jsonify, request
from models import db, Order, OrderItem, Product, Inventory

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")


@orders_bp.route("", methods=["GET"])
@orders_bp.route("/", methods=["GET"])
def list_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify(
        {
            "success": True,
            "count": len(orders),
            "data": [ord.to_dict() for ord in orders],
        }
    )


@orders_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"success": False, "message": "Order not found"}), 404
    return jsonify({"success": True, "data": order.to_dict()})


@orders_bp.route("", methods=["POST"])
@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.get_json() or {}

    customer_name = data.get("customer_name")
    customer_email = data.get("customer_email")
    shipping_address = data.get("shipping_address")
    items_data = data.get("items", [])

    if not customer_name or not customer_email or not shipping_address or not items_data:
        return jsonify(
            {
                "success": False,
                "message": "Missing required fields: customer_name, customer_email, shipping_address, items",
            }
        ), 400

    order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    calculated_total = 0.0
    order_items_to_create = []

    for item in items_data:
        product_id = item.get("product_id")
        quantity = int(item.get("quantity", 1))

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"success": False, "message": f"Product with ID {product_id} not found"}), 404

        # Check inventory
        if product.inventory and product.inventory.stock_quantity < quantity:
            return jsonify(
                {
                    "success": False,
                    "message": f"Insufficient stock for {product.name}. Available: {product.inventory.stock_quantity}",
                }
            ), 400

        unit_price = float(product.price)
        item_total = unit_price * quantity
        calculated_total += item_total

        # Deduct inventory
        if product.inventory:
            product.inventory.stock_quantity -= quantity

        order_items_to_create.append(
            {
                "product_id": product.id,
                "product_name": product.name,
                "unit_price": unit_price,
                "quantity": quantity,
                "total_price": item_total,
            }
        )

    order = Order(
        order_number=order_number,
        customer_id=data.get("customer_id"),
        customer_name=customer_name,
        customer_email=customer_email,
        shipping_address=shipping_address,
        total_amount=calculated_total,
        status="Processing",
        payment_status="Paid",
        payment_method=data.get("payment_method", "Credit Card"),
    )
    db.session.add(order)
    db.session.flush()

    for item_spec in order_items_to_create:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_spec["product_id"],
            product_name=item_spec["product_name"],
            unit_price=item_spec["unit_price"],
            quantity=item_spec["quantity"],
            total_price=item_spec["total_price"],
        )
        db.session.add(order_item)

    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": "Order created successfully",
                "data": order.to_dict(),
            }
        ),
        201,
    )
