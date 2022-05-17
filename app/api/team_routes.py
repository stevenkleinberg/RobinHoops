from crypt import methods
from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Team, TeamStock, db, User
from app.forms import TeamStockForm

team_routes = Blueprint('teams', __name__)

@team_routes.route('/')
def get_all_teams():
    teams = Team.query.all()
    return { "teams": [team.to_dict() for team in teams]}


@team_routes.route('/buy', methods=["POST"])
def buy_stock_in_team():
    '''
    BUY TEAM STOCK
    '''
    form = TeamStockForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_team_stock = TeamStock(
            user_id=form.data["user_id"],
            team_id=form.data["team_id"],
            shares=form.data["shares"],
            purchase_price=form.data["purchase_price"],
            current_value=(form.data["purchase_price"] * form.data["shares"])
        )

        db.session.add(new_team_stock)
        user = User.query.get(form.data["user_id"])

        user.cash_value = (user.cash_value - new_team_stock.current_value)
        user.assets_value = (user.assets_value + new_team_stock.current_value)
        db.session.commit()

        return user.to_dict()
    else:
      return {'errors': form.errors}, 401
