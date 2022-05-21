from crypt import methods
from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Team, TeamStock, db, User
from app.forms import TeamStockForm
from datetime import datetime


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
    #validate request
    form = TeamStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        #create new teamstock
        new_team_stock = TeamStock(
            user_id=form.data["user_id"],
            team_id=form.data["team_id"],
            shares=form.data["shares"],
            purchase_price=form.data["purchase_price"],
            current_value=(form.data["purchase_price"] * form.data["shares"])
        )
        db.session.add(new_team_stock)

        #grab related user and manipulate cash and asset values
        user = User.query.get(form.data["user_id"])
        user.cash_value = (user.cash_value - new_team_stock.current_value)
        user.assets_value = (user.assets_value + new_team_stock.current_value)

        #commit new teamstock and changes to user
        db.session.commit()

        #return the associated user to update the state
        return user.to_dict()
    else:
      return {'errors': form.errors}, 401

@team_routes.route('/sell/<int:id>', methods=['PUT', 'DELETE'])
def sell_stock_in_team(id):
    #IF PUT REQUEST WE SELL SOME SHARES
    if request.method == 'PUT':
        #validate request
        form = TeamStockForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            # grab the Teamstock, Team, and User
            changed_team_stock = TeamStock.query.get(int(id))
            team = Team.query.get(form.data["team_id"])
            user = User.query.get(form.data["user_id"])

            #calculate change in share #
            orig_shares = changed_team_stock.shares
            sold_shares = form.data["shares"]
            new_shares = orig_shares - sold_shares

            #calculate profit/loss from sold shares
            current_price = team.current_price
            sale_return = sold_shares * current_price

            #Change teamstock shares
            changed_team_stock.shares = new_shares
            changed_team_stock.current_value = changed_team_stock.current_value - sale_return

            #change user's cash and asset value
            user.cash_value = user.cash_value + sale_return
            user.assets_value = user.assets_value - sale_return

            #commit new teamstock and changes to user
            db.session.commit()
            #return the associated user to update the state
            return user.to_dict()

        #form validation failed, return error
        else:
            return {'errors': form.errors}, 401
    #IF NOT PUT, DELETE. SELL ALL SHARES AND DELETE.
    else:
        # grab the Teamstock, and User
        team_stock = TeamStock.query.get(int(id))
        user = User.query.get(team_stock.user_id)

        #grab the current value of the stock
        sale_return = team_stock.current_value

        #change user's cash and asset value
        user.cash_value = user.cash_value + sale_return
        user.assets_value = user.assets_value - sale_return

        # delete the teamStock and commit changes to user
        db.session.delete(team_stock)
        db.session.commit()

        #return the associated user to update the state
        return user.to_dict()


@team_routes.route('/buy/<int:id>', methods=['PUT'])
def buy_more_stock_in_team(id):
    form = TeamStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # grab the Teamstock, Team, and User
        changed_team_stock = TeamStock.query.get(int(id))
        team = Team.query.get(form.data["team_id"])
        user = User.query.get(form.data["user_id"])

        #calculate change in share #
        orig_shares = changed_team_stock.shares
        bought_shares = form.data["shares"]
        new_shares = orig_shares + bought_shares

        #calculate profit/loss from sold shares
        current_price = team.current_price
        sale_total = bought_shares * current_price

        #Change teamstock shares
        changed_team_stock.shares = new_shares
        changed_team_stock.current_value = changed_team_stock.current_value + sale_total

        #change user's cash and asset value
        user.cash_value = user.cash_value - sale_total
        user.assets_value = user.assets_value + sale_total

        #commit new teamstock and changes to user
        db.session.commit()
        #return the associated user to update the state
        return user.to_dict()

    #form validation failed, return error
    else:
        return {'errors': form.errors}, 401
