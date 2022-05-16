import React from 'react'
import TeamStockList from './teamStockList'
import "./stocklist.css"
import { useSelector } from "react-redux";


function StockList() {
    const teams = useSelector(state => state.teams.all)
    return (
        <div className='stocklist_container '>
            <div className='stocklist_body flex-column'>
                <div className='stocklist_header flex-row'>
                    Stocks
                </div>
                <div className='stocklist_main flex-column'>
                    <TeamStockList teams={teams} />
                    <div className='stocklist_players flex-column '>
                        <p> Player Stocks List</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockList
