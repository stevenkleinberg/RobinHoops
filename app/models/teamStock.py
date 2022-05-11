
from .db import db
from datetime import datetime

class TeamStock (db.Model):
    __tablename__ = 'teamStocks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    purchase_price = db.Column(db.Integer, nullable=False)
    current_value = db.Column(db.Integer, nullable=False)
    value_history = db.Column(db.Text)

    team = db.relationship("Team", back_populates="team_stocks")
    user = db.relationship("User", back_populates="team_stocks")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'team_id': self.team_id,
            'shares': self.shares,
            'purchase_price': self.purchase_price,
            'current_value': self.current_value,
            'value_history': self.value_history
        }
