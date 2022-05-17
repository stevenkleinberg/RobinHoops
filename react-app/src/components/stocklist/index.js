import React from 'react'
import AllTeamsList from './AllTeamsList';
import MyTeamsList from './MyTeamsList';
import "./stocklist.css"
import { useSelector } from "react-redux";


function StockList() {
    const teams = useSelector(state => state.teams.all)
    const team_stocks = useSelector(state => state.session.user.team_stocks)
    return (
        <div className='stocklist_container '>
            <div className='stocklist_body flex-column'>
                <div className='stocklist_header flex-row'>
                    Stocks
                </div>
                <div className='stocklist_main flex-column'>
                    <MyTeamsList team_stocks={team_stocks} />
                    <AllTeamsList teams={teams} />
                    <div className='stocklist_players flex-column '>
                        <p> Player Stocks List</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockList
