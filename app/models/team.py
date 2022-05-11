from .db import db
from datetime import datetime

class Team (db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(10), nullable=False)
    logo = db.Column(db.Text)
    city = db.Column(db.String(100))
    conference = db.Column(db.String(100))
    division = db.Column(db.String(100))
    win_loss_ratio = db.Column(db.Integer, nullable=False)
    games_played = db.Column(db.Integer)
    in_game = db.Column(db.Boolean, nullable=False, default=False)
    last_five = db.Column(db.Text)
    init_price = db.Column(db.Integer, nullable=False)
    current_price = db.Column(db.Integer, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    current_stats = db.Column(db.Text)
    price_history = db.Column(db.Text)

    players = db.relationship("Player", back_populates="team")
    team_stocks = db.relationship("TeamStock", back_populates="team")


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'city': self.city,
            'logo': self.logo,
            'conference': self.conference,
            'division': self.division,
            'win_loss_ratio': self.win_loss_ratio,
            'games_played': self.games_played,
            'in_game': self.in_game,
            'last_five': self.last_five,
            'init_price': self.init_price,
            'current_price': self.current_price,
            'last_updated': self.last_updated,
            'current_stats': self.current_stats,
            'price_history': self.price_history
        }
