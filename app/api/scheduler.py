from flask import Blueprint
from app.models import db, Test
from app import scheduler
from random import randrange
import requests

sched_bp = Blueprint('sched_bp', __name__)

@scheduler.task('interval', id="hello", seconds=3)
def scheduler_test():
    api_url = "https://jsonplaceholder.typicode.com/todos/2"
    res = requests.get(api_url)
    data = res.json()

    print("Fetched data, pushing to db")
    print(randrange(200),data['id'],data['title'],data['completed'])
    with scheduler.app.app_context():
        new_task = Test(userId=int(randrange(200)),
                        id=int(randrange(200)),
                        title=str(data['title']),
                        completed=bool(data['completed']))
        db.session.add(new_task)
        db.session.commit()
