from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired


class PlayerStockForm(FlaskForm):
    id = IntegerField('id')
    user_id = IntegerField('user_id', validators=[DataRequired()])
    player_id = IntegerField('player_id', validators=[DataRequired()])
    shares = IntegerField('shares', validators=[DataRequired()])
    purchase_price = IntegerField('purchase_price', validators=[DataRequired()])
