from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired


class TeamStockForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired()])
    team_id = IntegerField('team_id', validators=[DataRequired()])
    shares = IntegerField('shares', validators=[DataRequired()])
    purchase_price = IntegerField('purchase_price', validators=[DataRequired()])
