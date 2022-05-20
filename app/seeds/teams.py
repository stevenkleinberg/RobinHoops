import json
import os
from app.models import db, Team


# Adds a demo user, you can add other users here if you want
def seed_teams():
    f = open(os.getcwd()+"/app/seeds/teams.json")

    data = json.load(f)

    for team_dict in data['teams']:
        new_team = Team(
            id=int(team_dict["id"]),
            name=team_dict["name"],
            city=team_dict["city"],
            code=team_dict["code"],
            logo=team_dict["logo"],
            conference=team_dict["conference"],
            division=team_dict["division"],
            win_loss_ratio=int(team_dict["win_loss_ratio"]),
            games_played=int(len(team_dict["price_history"])),
            init_price=(int(team_dict["win_loss_ratio"]) * 200),
            current_price=(int(team_dict["win_loss_ratio"]) * 200),
            price_history=[ int(price) for price in team_dict["price_history"]]
            )
        db.session.add(new_team)

    db.session.commit()

    f.close()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_teams():
    db.session.execute('TRUNCATE teams RESTART IDENTITY CASCADE;')
    db.session.commit()
