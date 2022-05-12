from flask import Blueprint, jsonify, session, request
import requests
import json

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


@nba_routes.route('/')
def getNBAteams():
    nba_team_ids = [1,2,4,5,6,7,8,9,10,11,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,38,40,41]

    # nba_team_ids = [1,2]

    nba_team_data = list(map(get_team_by_id, nba_team_ids))

    nba_teams = {nba_team_ids[i]: nba_team_data[i] for i in range(len(nba_team_ids))}


    return nba_teams
