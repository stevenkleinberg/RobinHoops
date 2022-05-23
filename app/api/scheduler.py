from flask import Blueprint, jsonify, session, request
from app import scheduler
from datetime import datetime
import json
from app.models import Team, TeamStock, db, User, Player, PlayerStock
from sqlalchemy import null
import requests

sched_bp = Blueprint('sched_bp', __name__)

def get_games_by_day(day):
    url = "https://api-nba-v1.p.rapidapi.com/games"

    querystring = {"date": day}

    headers = {
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "defda67798msh132ff4fa1fb51bfp1290d3jsn8633cf0b21c0"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    data = response.content
    json_data = json.loads(data)
    json_dict = dict(json_data)

    games_list = json_dict["response"]

    teams_win_or_lose = []

    for game in games_list:
        if game["date"]["end"]:
            visitor = game["teams"]["visitors"]["id"]
            home = game["teams"]["home"]["id"]
            game_id = game["id"]
            if game["scores"]["visitors"]["points"] > game["scores"]["home"]["points"]:
                teams_win_or_lose.append((visitor, True, game_id))
                teams_win_or_lose.append((home, False, game_id))
            else:
                teams_win_or_lose.append((visitor, False, game_id))
                teams_win_or_lose.append((home, True, game_id))

    return teams_win_or_lose

def get_player_stats_by_game_id(id):
    url = "https://api-nba-v1.p.rapidapi.com/players/statistics"

    querystring = {"game": str(id)}

    headers = {
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "defda67798msh132ff4fa1fb51bfp1290d3jsn8633cf0b21c0"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    data = response.content
    json_data = json.loads(data)
    json_dict = dict(json_data)

    players_list = json_dict["response"]

    players = {}

    for player in players_list:
        player_id = player["player"]["id"]
        points = player["points"]
        if points:
            players[player_id] = { "id": player_id, "points": points}
    return players

@scheduler.task('interval', id="hello", minutes=5)
def scheduler_daily_updates():
    print("=========scheduled activity===========")
    today = datetime.today().date()

    teams_win_loss = get_games_by_day(str(today))
    with scheduler.app.app_context():
        for team_tuple in teams_win_loss:

            team = Team.query.get(int(team_tuple[0]))
            if team:
                if team.last_updated.date() < today:
                    old_price = team.current_price

                    if team_tuple[1]:
                        new_wins = ((float(team.win_loss_ratio / 1000) *  float(team.games_played)) + 1 )
                        new_games =  team.games_played + 1
                        new_wlr =int((new_wins / new_games) * 1000 )
                        team.games_played += 1
                        team.win_loss_ratio = new_wlr
                        team.current_price = new_wlr * 200
                        team.price_history = team.price_history[0:-1] + ","+ str(team.win_loss_ratio) + "}"
                    else:
                        wins = ((float(team.win_loss_ratio / 1000) *  float(team.games_played)))
                        new_games =  team.games_played + 1
                        new_wlr =int((wins / new_games) * 1000 )
                        team.games_played += 1
                        team.win_loss_ratio = new_wlr
                        team.current_price = new_wlr * 200
                        team.price_history = team.price_history[0:-1] + ","+ str(team.win_loss_ratio )  + "}"
                    team.last_updated = datetime.today()


                    teamstocks = TeamStock.query.filter_by(team_id=team.id)
                    if teamstocks:
                        for teamstock in teamstocks:
                            user = User.query.get(teamstock.user_id)
                            shares = teamstock.shares
                            current_price = team.current_price
                            orig_assets_val = user.assets_value
                            num_to_sub = int(shares * old_price)
                            num_to_add = int(shares * current_price)
                            new_val = (orig_assets_val - num_to_sub ) + num_to_add
                            user.assets_value = new_val
                            playerstock.current_value = num_to_add



        games = list(set([team_tuple[2] for team_tuple in teams_win_loss]))

        player_stats_by_game= list(map(get_player_stats_by_game_id, games))

        for game in player_stats_by_game:
            players = game.values()
            for stats in players:
                player = Player.query.get(int(stats["id"]))
                if player:
                    if player.last_updated.date() < today:

                        old_price = player.current_price
                        new_points = ((float(player.ppg / 1000) *  float(player.games_played)) + float(stats["points"]))
                        new_games = player.games_played + 1
                        new_ppg = int((new_points / new_games) * 1000)
                        player.ppg = new_ppg
                        player.games_played = new_games
                        player.current_price = new_ppg * 10
                        player.price_history = player.price_history[0:-1] + ","+ str(new_ppg * 10) + "}"
                        player.last_updated = datetime.today()


                        playerstocks = PlayerStock.query.filter_by(player_id=player.id)
                        if playerstocks:
                            for playerstock in playerstocks:
                                user = User.query.get(playerstock.user_id)

                                shares = playerstock.shares
                                current_price = playerstock.current_price
                                orig_assets_val = user.assets_value
                                num_to_sub =(shares * old_price)
                                num_to_add =(shares * current_price)
                                new_val = orig_assets_val - num_to_sub + num_to_add
                                user.assets_value = new_val
                                playerstock.current_value = num_to_add
        db.session.commit()


    return "sucsess!"
