# RobinHoops
## Overview
RobinHoops is a stock trading platform that allows you to, invest in your real dreams, your hoopdreams. It is a clone of stock trading app RobinHood, but instead of buying and selling boring stocks you can buy sell your favorite NBA teams and players.

Put your NBA knowledge to the test! Buy low, sell high, and turn buckets into buckets of cash! 

## Architecture 
RobinHooops runs on a React frontend with a Flask backend and a PostgreSQL as a database. The application also receives updates on the latest scores and stats from API-NBA, a third party API keeping your investments value and prices as current as possible. It also uses Plotly to visually represent the growth, decay, and history of NBA teams and players.
## Technologies used
**Frontend**

-   [React](https://reactjs.org/)
-   [Redux](https://redux.js.org/)
-   [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
-   [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
-   [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

**Backend**

-   [Flask](https://flask.palletsprojects.com/en/2.1.x/)
-   [Python](https://docs.python.org/3/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [SQLAlchemy](https://www.sqlalchemy.org/)
-  [Flask-APScheduler](https://viniciuschiele.github.io/flask-apscheduler/)

 
**API**
- [NBA-API](https://rapidapi.com/api-sports/api/api-nba)


## Setup
1.  Clone this repository ( [https://github.com/stevenkleinberg/RobinHoops.git](https://github.com/stevenkleinberg/RobinHoops.git) )
2.  Install dependencies -  `pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt`
3.  Create a  `.env`  file based on the  **.env.example**  with proper settings required for the development environment
4.  Setup PostgreSQL user, password and database and to make sure it matches the  **.env**  file
5.  Get into pipenv, migrate the database, seed the database, and run the flask app using the following commands:
    -   `pipenv shell`
    -   `flask db upgrade`
    -   `flask seed all`
    -   `flask run`
6.  To run the React App in development, checkout the  [README](https://github.com/stevenkleinberg/RobinHoops/blob/main/react-app/README.md)  inside the  `react-app`  directory.

## Features
### Portfolio
RobinHoops investors can view their portfolios balance, amount of change, percent of change, and a breakdown of their finances. On the Portfolio page investors can also directly access their player and team investments, as well as other investment opportunities around the league.  
![portfolio](https://user-images.githubusercontent.com/94195000/169759595-d72d3866-d44b-49c4-b610-65dfb462f823.png)


### Player Details
Investors can view a players historical price data, scoring and position information, and value growth.
![player_deets](https://user-images.githubusercontent.com/94195000/169759623-24570e4e-8210-4391-a291-fa4311f0c8bd.png)

### Team Details
Investors can view a teams historical price data, record and league information, and value growth.
![team_deets](https://user-images.githubusercontent.com/94195000/169759642-dae7c9b4-1ff6-4a72-b763-76ee1bf3136b.png)

### Transactions
Investors can freely transact within their means with the ability to buy into a Player or Team at their given price.  
 	
 ******
 ***Players***
- Buy shares of your favorite player
- ![buy_player](https://user-images.githubusercontent.com/94195000/169759732-0cb19c70-f76a-43f6-b395-73bdb7a03720.png)

- Sell Shares
- ![sell_player](https://user-images.githubusercontent.com/94195000/169759749-c78abbfb-83db-4a7c-a5e1-407be6dcdaac.png)

- Double down and buy even more!
- ![player_buymore](https://user-images.githubusercontent.com/94195000/169759760-04a797df-0953-4be7-8374-f6f7ab1b6e66.png)

- 
 ***Teams***
- Buy shares of your favorite Team
- ![team_buy](https://user-images.githubusercontent.com/94195000/169759676-8adf376b-28b2-447b-82aa-0db47ce3b7bc.png)

- Sell High!
- ![team_sell](https://user-images.githubusercontent.com/94195000/169759703-f7a079ed-3ab2-4a17-95e2-d2edae3cb67a.png)

- Double down and buy even more!
- ![team_buymore](https://user-images.githubusercontent.com/94195000/169759720-751d29cd-fe30-49ee-acb1-190960719112.png)


### Search
Investors can quickly navigate to any player or team with the integrated search bar.
![search_bar](https://user-images.githubusercontent.com/94195000/169759775-2588990d-707a-4322-9677-210ca47b5aaf.png)

## Link to Wiki docs

[RobinHoops Wiki Docs](https://github.com/stevenkleinberg/RobinHoops/wiki)
