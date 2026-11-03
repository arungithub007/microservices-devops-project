"""
Cart API Route handlers supporting session-based and customer carts.
"""
from flask import Blueprint, jsonify, request
from models import db, Cart, Product

cart_bp = Blueprint("cart", __name__, url_prefix="/cart")


@cart_bp.route("", methods=["GET"])
@cart_bp.route("/", methods=["GET"])
def get_cart():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"success": False, "message": "session_id parameter is required"}), 400

    cart_items = Cart.query.filter_by(session_id=session_id).all()
    subtotal = sum(item.line_total for item in [item.to_dict() for item in cart_items])
    item_count = sum(item.quantity for item in cart_items)

    return jsonify(
        {
            "success": True,
            "session_id": session_id,
            "item_count": item_count,
            "subtotal": round(subtotal, 2),
            "data": [item.to_dict() for item in cart_items],
        }
    )


@cart_bp.route("", methods=["POST"])
@cart_bp.route("/", methods=["POST"])
def add_to_cart():
    data = request.get_json() or {}
    session_id = data.get("session_id")
    product_id = data.get("product_id")
    quantity = int(data.get("quantity", 1))

    if not session_id or not product_id:
        return jsonify({"success": False, "message": "session_id and product_id are required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    cart_item = Cart.query.filter_by(session_id=session_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(
            session_id=session_id,
            customer_id=data.get("customer_id"),
            product_id=product_id,
            quantity=quantity,
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"success": True, "message": "Cart updated", "data": cart_item.to_dict()})


@cart_bp.route("/<int:item_id>", methods=["DELETE"])
def remove_cart_item(item_id):
    item = Cart.query.get(item_id)
    if not item:
        return jsonify({"success": False, "message": "Cart item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Item removed from cart"})


@cart_bp.route("/clear", methods=["POST"])
def clear_cart():
    data = request.get_json() or {}
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"success": False, "message": "session_id is required"}), 400

    Cart.query.filter_by(session_id=session_id).delete()
    db.session.commit()
    return jsonify({"success": True, "message": "Cart cleared successfully"})
