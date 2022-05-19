from crypt import methods
from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.api.team_routes import buy_stock_in_team
from app.models import Player, PlayerStock, db, User
from app.forms import PlayerStockForm

player_routes = Blueprint('players', __name__)

@player_routes.route('/')
def get_all_players():
    players = Player.query.all()
    return { "players": [player.to_dict() for player in players]}


@player_routes.route('/buy', methods=["POST"])
def buy_stock_in_player():
    '''
    BUY TEAM STOCK
    '''
    #validate request

    form = PlayerStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        #create new teamstock
        new_player_stock = PlayerStock(
            user_id=form.data["user_id"],
            player_id=form.data["player_id"],
            shares=form.data["shares"],
            purchase_price=form.data["purchase_price"],
            current_value=(form.data["purchase_price"] * form.data["shares"])
        )
        db.session.add(new_player_stock)

        #grab related user and manipulate cash and asset values
        user = User.query.get(form.data["user_id"])
        user.cash_value = (user.cash_value - new_player_stock.current_value)
        user.assets_value = (user.assets_value + new_player_stock.current_value)

        #commit new teamstock and changes to user
        db.session.commit()

        #return the associated user to update the state
        return user.to_dict()
    else:
        return {'errors': form.errors}, 401

@player_routes.route('/sell/<int:id>', methods=['PUT', 'DELETE'])
def sell_stock_in_player(id):
    #IF PUT REQUEST WE SELL SOME SHARES
    if request.method == 'PUT':
        #validate request
        form = PlayerStockForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            # grab the playerstock, player, and User
            changed_player_stock = PlayerStock.query.get(int(id))
            player = Player.query.get(form.data["player_id"])
            user = User.query.get(form.data["user_id"])

            #calculate change in share #
            orig_shares = changed_player_stock.shares
            sold_shares = form.data["shares"]
            new_shares = orig_shares - sold_shares

            #calculate profit/loss from sold shares
            current_price = player.current_price
            sale_return = sold_shares * current_price

            #Change playerstock shares
            changed_player_stock.shares = new_shares
            changed_player_stock.current_value = changed_player_stock.current_value - sale_return

            #change user's cash and asset value
            user.cash_value = user.cash_value + sale_return
            user.assets_value = user.assets_value - sale_return

            #commit new playerstock and changes to user
            db.session.commit()
            #return the associated user to update the state
            return user.to_dict()

        #form validation failed, return error
        else:
            return {'errors': form.errors}, 401
    #IF NOT PUT, DELETE. SELL ALL SHARES AND DELETE.
    else:
        # grab the playerstock, and User
        player_stock = PlayerStock.query.get(int(id))
        user = User.query.get(player_stock.user_id)

        #grab the current value of the stock
        sale_return = player_stock.current_value

        #change user's cash and asset value
        user.cash_value = user.cash_value + sale_return
        user.assets_value = user.assets_value - sale_return

        # delete the playerStock and commit changes to user
        db.session.delete(player_stock)
        db.session.commit()

        #return the associated user to update the state
        return user.to_dict()
