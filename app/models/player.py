
from .db import db
from datetime import datetime

class Player (db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    ppg = db.Column(db.Integer, nullable=False)
    position = db.Column(db.String(10))
    games_played = db.Column(db.Integer)
    in_game = db.Column(db.Boolean, nullable=False, default=False)
    last_five = db.Column(db.Text)
    init_price = db.Column(db.Integer, nullable=False)
    current_price = db.Column(db.Integer, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    current_stats = db.Column(db.Text)
    price_history = db.Column(db.Text)

    team = db.relationship("Team", back_populates="players")
    player_stocks = db.relationship("PlayerStock", back_populates="player")


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'team_id': self.team_id,
            'ppg': self.ppg,
            'position': self.position,
            'games_played': self.games_played,
            'in_game': self.in_game,
            'last_five': self.last_five,
            'init_price': self.init_price,
            'current_price': self.current_price,
            'last_updated': self.last_updated,
            'current_stats': self.current_stats,
            'price_history': self.price_history
        }
