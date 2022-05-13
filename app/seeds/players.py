import json
import os
from turtle import position
from app.models import db, Player


# Adds a demo user, you can add other users here if you want
def seed_players():
    f = open(os.getcwd()+"/app/seeds/players.json")

    data = json.load(f)

    for player_dict in data['players']:
        new_player = Player(
            id=player_dict["id"],
            name=player_dict["name"],
            team_id=player_dict["team_id"],
            ppg=player_dict["ppg"],
            games_played=player_dict["gamnes_played"],
            position=player_dict["position"],
            init_price=(int(player_dict["ppg"]) *10),
            current_price=(int(player_dict["ppg"]) *10)
        )
        db.session.add(new_player)
    db.session.commit()

    f.close()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_players():
    db.session.execute('TRUNCATE players RESTART IDENTITY CASCADE;')
    db.session.commit()