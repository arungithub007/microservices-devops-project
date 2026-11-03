"""
SQLAlchemy Database Models for Traditional Fashion & Beauty Store Microservice
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    products = db.relationship("Product", backref="category", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "image_url": self.image_url,
            "product_count": len(self.products) if self.products else 0,
        }


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    compare_at_price = db.Column(db.Numeric(10, 2), nullable=True)
    sku = db.Column(db.String(100), nullable=False, unique=True)
    material = db.Column(db.String(100))
    color = db.Column(db.String(100))
    size_or_dimension = db.Column(db.String(100))
    rating = db.Column(db.Numeric(2, 1), default=4.5)
    review_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    is_trending = db.Column(db.Boolean, default=False)
    image_url = db.Column(db.String(500), nullable=False)
    gallery_urls = db.Column(db.ARRAY(db.Text), default=[])
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    inventory = db.relationship("Inventory", backref="product", uselist=False, lazy=True)

    def to_dict(self):
        stock = self.inventory.stock_quantity if self.inventory else 25
        return {
            "id": self.id,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None,
            "category_slug": self.category.slug if self.category else None,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "price": float(self.price),
            "compare_at_price": float(self.compare_at_price) if self.compare_at_price else None,
            "sku": self.sku,
            "material": self.material,
            "color": self.color,
            "size_or_dimension": self.size_or_dimension,
            "rating": float(self.rating) if self.rating else 4.5,
            "review_count": self.review_count,
            "is_featured": self.is_featured,
            "is_trending": self.is_trending,
            "image_url": self.image_url,
            "gallery_urls": self.gallery_urls if self.gallery_urls else [self.image_url],
            "stock_quantity": stock,
            "in_stock": stock > 0,
        }


class Inventory(db.Model):
    __tablename__ = "inventory"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), unique=True, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0, nullable=False)
    reorder_level = db.Column(db.Integer, default=5)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.String(30))
    address_line1 = db.Column(db.String(255))
    address_line2 = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100), default="India")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship("Order", backref="customer", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": f"{self.first_name} {self.last_name}",
            "email": self.email,
            "phone": self.phone,
            "address": {
                "line1": self.address_line1,
                "line2": self.address_line2,
                "city": self.city,
                "state": self.state,
                "postal_code": self.postal_code,
                "country": self.country,
            },
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), nullable=False, unique=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=True)
    customer_name = db.Column(db.String(200), nullable=False)
    customer_email = db.Column(db.String(255), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default="Pending")
    payment_status = db.Column(db.String(50), default="Pending")
    payment_method = db.Column(db.String(50), default="Credit Card")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = db.relationship("OrderItem", backref="order", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "customer_id": self.customer_id,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "shipping_address": self.shipping_address,
            "total_amount": float(self.total_amount),
            "status": self.status,
            "payment_status": self.payment_status,
            "payment_method": self.payment_method,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in self.items],
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product_name,
            "unit_price": float(self.unit_price),
            "quantity": self.quantity,
            "total_price": float(self.total_price),
        }


class Cart(db.Model):
    __tablename__ = "cart"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = db.relationship("Product", lazy=True)

    def to_dict(self):
        prod_dict = self.product.to_dict() if self.product else None
        return {
            "id": self.id,
            "session_id": self.session_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "product": prod_dict,
            "line_total": float(self.product.price * self.quantity) if self.product else 0.0,
        }
