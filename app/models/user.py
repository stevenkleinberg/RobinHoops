from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))
    hashed_password = db.Column(db.String(255), nullable=False)
    remaining_fetches = db.Column(db.Integer)
    last_fetch = db.Column(db.DateTime,  nullable=False, default=datetime.now())
    init_value = db.Column(db.Numeric(10,2), nullable=False, default=500000.00)
    cash_value = db.Column(db.Numeric(10,2),  nullable=False, default=500000.00)
    assets_value = db.Column(db.Numeric(10,2), nullable=False, default=0.00)
    value_history = db.Column(db.Text)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
