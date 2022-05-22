from flask import Blueprint, jsonify, session, request
import requests
import json
from datetime import datetime
from app.models import Team, TeamStock, db, User, Player, PlayerStock

from sqlalchemy import null

nba_routes = Blueprint('NBA', __name__)

def get_team_by_id(id):
    url = "https://api-nba-v1.p.rapidapi.com/standings"

    querystring = {"league":"standard","season":"2021","team": str(id)}

    headers = {
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "defda67798msh132ff4fa1fb51bfp1290d3jsn8633cf0b21c0"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    data = response.content
    json_data = json.loads(data)
    json_dict = dict(json_data)

    return json_dict["response"]

def  get_games_by_team_id(id):
    url = "https://api-nba-v1.p.rapidapi.com/games"

    querystring = {"season":"2021","team":str(id)}

    headers = {
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "defda67798msh132ff4fa1fb51bfp1290d3jsn8633cf0b21c0"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    data = response.content
    json_data = json.loads(data)
    json_dict = dict(json_data)
    games_list = json_dict["response"]

    total_games = 0
    total_wins = 0
    price_history = []

    for game in games_list:

        if game["scores"]["visitors"]["points"]:
            total_games += 1
            if game["teams"]["home"]["id"] == id:
                if game["scores"]["visitors"]["points"] < game["scores"]["home"]["points"]:
                    total_wins += 1
            else:
                if game["scores"]["visitors"]["points"] > game["scores"]["home"]["points"]:
                    total_wins += 1
            raw_wlr_at_game = total_wins / total_games
            wlr_at_game = int(round(raw_wlr_at_game , 3) * 1000)
            price_history.append(wlr_at_game)
    return price_history



def get_player_by_id(id):
    url = "https://api-nba-v1.p.rapidapi.com/players/statistics"

    querystring = {"id":str(id),"season":"2021"}

    headers = {
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "defda67798msh132ff4fa1fb51bfp1290d3jsn8633cf0b21c0"
    }
    response = requests.request("GET", url, headers=headers, params=querystring)
    data = response.content
    json_data = json.loads(data)
    json_dict = dict(json_data)

    games_list = json_dict["response"]


    total_games = 0
    total_points = 0
    first_name = games_list[0]["player"]["firstname"]
    last_name = games_list[0]["player"]["lastname"]
    team_id = games_list[-1]["team"]["id"]
    position = games_list[0]["pos"]
    price_history = []

    for game in games_list:
        points = game["points"]
        if game["pos"]:
            position = game["pos"]
        if points:
            total_games += 1
            total_points += points
            raw_ppg_at_game = total_points / total_games
            ppg_at_game = int(round(raw_ppg_at_game , 2) * 1000)
            price_history.append(ppg_at_game)


    if total_points < 600:
        return None
    ppg_raw= total_points / total_games
    ppg = int(round(ppg_raw, 2) * 100)

    return {
        "id" : id,
        "name" : first_name + " " + last_name,
        "team_id": team_id,
        "position": position,
        "ppg":ppg,
        "games_played": total_games,
        "price_history":price_history
    }

def get_player_ids_by_team_ids(id):
    url = "https://api-nba-v1.p.rapidapi.com/players"

    querystring = {"team":str(id),"season":"2021"}

    headers = {
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "defda67798msh132ff4fa1fb51bfp1290d3jsn8633cf0b21c0"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    data = response.content
    json_data = json.loads(data)
    json_dict = dict(json_data)

    players_list = json_dict["response"]

    player_ids = [player["id"] for player in players_list]
    return player_ids

@nba_routes.route('/teams')
def getNBAteams():
    nba_team_ids = [1,2,4,5,6,7,8,9,10,11,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,38,40,41]

    # nba_team_ids = [1,2]

    nba_team_data = list(map(get_team_by_id, nba_team_ids))
    print
    nba_teams = {nba_team_ids[i]: nba_team_data[i] for i in range(len(nba_team_ids))}

    history_dict = {}
    for id in nba_team_ids:
        history= get_games_by_team_id(id)
        print("========historyyyyyyyyy============", "=======", id, "=================", history, "=====================end of teams history=====================")
        history_dict[id] = history

    return history_dict


@nba_routes.route('/players/')
def getNBAPlayers():
    nba_team_ids = [1,2,4,5,6,7,8,9,10,11,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,38,40,41]

    nba_player_ids_by_team_list = list(map( get_player_ids_by_team_ids ,nba_team_ids))
    actual_player_ids = []
    for player_id_list in nba_player_ids_by_team_list:
        no_duplicates = list(set(actual_player_ids + player_id_list))
        actual_player_ids = no_duplicates

    nba_player_data = list(map(get_player_by_id, actual_player_ids))

    players = {actual_player_ids[i]: nba_player_data[i] for i in range(len(actual_player_ids))}

    to_delete = []

    for key in players:
        if players[key] == None:
            to_delete.append(key)

    for id in to_delete:
        del players[id]

    return{ "players": [players[player] for player in players] }

def get_games_by_day(day):
    import requests
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



@nba_routes.route('/daily/')
def get_last_nights_data():
    today = datetime.today().date()

    teams_win_loss = get_games_by_day(str(today))
    for team_tuple in teams_win_loss:

        team = Team.query.get(int(team_tuple[0]))
        if team:
            print(team.to_dict())
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
        # db.session.commit()
            print(team.to_dict())


    games = list(set([team_tuple[2] for team_tuple in teams_win_loss]))

    player_stats_by_game= list(map(get_player_stats_by_game_id, games))

    for game in player_stats_by_game:
        players = game.values()
        for stats in players:
            player = Player.query.get(int(stats["id"]))
            if player:
                new_points = ((float(player.ppg / 1000) *  float(player.games_played)) + float(stats["points"]))
                new_games = player.games_played + 1
                new_ppg = int((new_points / new_games) * 1000)
                player.ppg = new_ppg
                player.games_played = new_games
                player.current_price = new_ppg * 10
                player.price_history = player.price_history[0:-1] + ","+ str(new_ppg * 10) + "}"
                # db.session.commit()


    return "sucsess!"
