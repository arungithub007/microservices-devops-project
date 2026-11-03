"""
Products API Route handlers with filtering, pagination, and CRUD capabilities.
"""
import re
from flask import Blueprint, jsonify, request
from models import db, Product, Category, Inventory

products_bp = Blueprint("products", __name__, url_prefix="/products")


def generate_slug(text_val):
    clean = re.sub(r"[^\w\s-]", "", text_val).strip().lower()
    return re.sub(r"[-\s]+", "-", clean)


@products_bp.route("", methods=["GET"])
@products_bp.route("/", methods=["GET"])
def list_products():
    query = Product.query

    # Category filter (by ID or Slug)
    category_param = request.args.get("category")
    if category_param:
        if category_param.isdigit():
            query = query.filter(Product.category_id == int(category_param))
        else:
            cat = Category.query.filter_by(slug=category_param).first()
            if cat:
                query = query.filter(Product.category_id == cat.id)
            else:
                return jsonify({"success": True, "count": 0, "data": []})

    # Material filter
    material = request.args.get("material")
    if material:
        query = query.filter(Product.material.ilike(f"%{material}%"))

    # Color filter
    color = request.args.get("color")
    if color:
        query = query.filter(Product.color.ilike(f"%{color}%"))

    # Featured filter
    featured = request.args.get("featured")
    if featured and featured.lower() in ("true", "1"):
        query = query.filter(Product.is_featured == True)

    # Trending filter
    trending = request.args.get("trending")
    if trending and trending.lower() in ("true", "1"):
        query = query.filter(Product.is_trending == True)

    # Price range
    min_price = request.args.get("min_price")
    if min_price:
        try:
            query = query.filter(Product.price >= float(min_price))
        except ValueError:
            pass

    max_price = request.args.get("max_price")
    if max_price:
        try:
            query = query.filter(Product.price <= float(max_price))
        except ValueError:
            pass

    # Search keyword
    q = request.args.get("q")
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(search_pattern),
                Product.description.ilike(search_pattern),
                Product.material.ilike(search_pattern),
                Product.color.ilike(search_pattern),
            )
        )

    # Sorting
    sort_by = request.args.get("sort", "id")
    order = request.args.get("order", "asc")
    if hasattr(Product, sort_by):
        col = getattr(Product, sort_by)
        query = query.order_by(col.desc() if order == "desc" else col.asc())
    else:
        query = query.order_by(Product.id.asc())

    products = query.all()
    return jsonify(
        {
            "success": True,
            "count": len(products),
            "data": [p.to_dict() for p in products],
        }
    )


@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    return jsonify({"success": True, "data": product.to_dict()})


@products_bp.route("", methods=["POST"])
@products_bp.route("/", methods=["POST"])
def create_product():
    data = request.get_json() or {}
    required_fields = ["name", "category_id", "price", "sku", "image_url"]
    for field in required_fields:
        if field not in data:
            return jsonify({"success": False, "message": f"Missing required field: {field}"}), 400

    slug = data.get("slug") or generate_slug(data["name"])

    # Check for uniqueness of sku and slug
    if Product.query.filter_by(sku=data["sku"]).first():
        return jsonify({"success": False, "message": "SKU already exists"}), 409

    if Product.query.filter_by(slug=slug).first():
        slug = f"{slug}-{Product.query.count() + 1}"

    product = Product(
        name=data["name"],
        slug=slug,
        category_id=data["category_id"],
        description=data.get("description", ""),
        price=data["price"],
        compare_at_price=data.get("compare_at_price"),
        sku=data["sku"],
        material=data.get("material"),
        color=data.get("color"),
        size_or_dimension=data.get("size_or_dimension"),
        rating=data.get("rating", 4.5),
        review_count=data.get("review_count", 0),
        is_featured=data.get("is_featured", False),
        is_trending=data.get("is_trending", False),
        image_url=data["image_url"],
        gallery_urls=data.get("gallery_urls", [data["image_url"]]),
    )
    db.session.add(product)
    db.session.flush()

    stock_qty = data.get("stock_quantity", 20)
    inventory = Inventory(product_id=product.id, stock_quantity=stock_qty)
    db.session.add(inventory)
    db.session.commit()

    return jsonify({"success": True, "message": "Product created successfully", "data": product.to_dict()}), 201


@products_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    data = request.get_json() or {}
    if "name" in data:
        product.name = data["name"]
    if "category_id" in data:
        product.category_id = data["category_id"]
    if "description" in data:
        product.description = data["description"]
    if "price" in data:
        product.price = data["price"]
    if "compare_at_price" in data:
        product.compare_at_price = data["compare_at_price"]
    if "material" in data:
        product.material = data["material"]
    if "color" in data:
        product.color = data["color"]
    if "size_or_dimension" in data:
        product.size_or_dimension = data["size_or_dimension"]
    if "is_featured" in data:
        product.is_featured = data["is_featured"]
    if "is_trending" in data:
        product.is_trending = data["is_trending"]
    if "image_url" in data:
        product.image_url = data["image_url"]

    if "stock_quantity" in data:
        if product.inventory:
            product.inventory.stock_quantity = data["stock_quantity"]
        else:
            inv = Inventory(product_id=product.id, stock_quantity=data["stock_quantity"])
            db.session.add(inv)

    db.session.commit()
    return jsonify({"success": True, "message": "Product updated successfully", "data": product.to_dict()})


@products_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    if product.inventory:
        db.session.delete(product.inventory)
    db.session.delete(product)
    db.session.commit()

    return jsonify({"success": True, "message": "Product deleted successfully"})
