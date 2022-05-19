import React from 'react'
import AllTeamsList from './AllTeamsList';
import MyTeamsList from './MyTeamsList';
import AllPlayersList from './AllPlayersList';
import MyPlayersList from './MyPlayersList';
import "./stocklist.css"
import { useSelector } from "react-redux";


function StockList() {
    const teams = useSelector(state => state.teams.all)
    const players = useSelector(state => state.players.all)
    const player_stocks = useSelector(state => state.session.user.player_stocks)
    const team_stocks = useSelector(state => state.session.user.team_stocks)
    return (
        <div className='stocklist_container '>
            <div className='stocklist_body flex-column'>
                <div className='stocklist_header flex-row'>
                    Stocks
                </div>
                <div className='stocklist_main flex-column'>
                    <MyTeamsList team_stocks={team_stocks} />
                    <MyPlayersList player_stocks={player_stocks} />
                    <AllTeamsList teams={teams} />
                    <AllPlayersList players={players} />
                </div>
            </div>
        </div>
    )
}

export default StockList
