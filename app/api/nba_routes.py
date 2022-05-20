from flask import Blueprint, jsonify, session, request
import requests
import json

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

    nba_teams = {nba_team_ids[i]: nba_team_data[i] for i in range(len(nba_team_ids))}


    return nba_teams


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
