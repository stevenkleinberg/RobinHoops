from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Team

team_routes = Blueprint('teams', __name__)

@team_routes.route('/')
def get_all_teams():
    teams = Team.query.all()
    return { "teams": [team.to_dict() for team in teams]}
