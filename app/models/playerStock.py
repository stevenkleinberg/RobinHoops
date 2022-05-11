from .db import db
from datetime import datetime

class PlayerStock (db.Model):
    __tablename__ = 'playerStocks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    purchase_price = db.Column(db.Integer, nullable=False)
    current_value = db.Column(db.Integer, nullable=False)
    value_history = db.Column(db.Text)

    player = db.relationship("Player", back_populates="player_stocks")
    user = db.relationship("User", back_populates="player_stocks")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'player_id': self.player_id,
            'shares': self.shares,
            'purchase_price': self.purchase_price,
            'current_value': self.current_value,
            'value_history': self.value_history
        }
