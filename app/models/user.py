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
    last_fetch = db.Column(db.DateTime,  nullable=False, default=datetime.utcnow())
    init_value = db.Column(db.Integer, nullable=False, default=50000000)
    cash_value = db.Column(db.Integer,  nullable=False, default=50000000)
    assets_value = db.Column(db.Integer, nullable=False, default=0)
    value_history = db.Column(db.Text)

    team_stocks = db.relationship("TeamStock", back_populates="user")
    player_stocks = db.relationship("PlayerStock", back_populates="user")


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
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'remaining_fetches': self.remaining_fetches,
            'last_fetch': self.last_fetch,
            'init_value': self.init_value,
            'cash_value': self.cash_value,
            'assets_value': self.assets_value,
            'value_history': self.value_history,
            'team_stocks': [team_stock.to_dict() for team_stock in self.team_stocks],
            'player_stocks': [player_stock.to_dict() for player_stock in self.player_stocks]
        }
