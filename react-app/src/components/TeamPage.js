import React, { useState, useEffect, } from "react";
import StockList from './stocklist'
import TeamDetailCard from "./detailCard/teamDetail";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams  } from "react-router-dom";
import TeamTransactionBox from "./TransactionBox/TeamTransactionBox";
function TeamPage() {
    const { id }= useParams()
    const team = useSelector(state => state.teams[id])

if(!team){
    return(
        <></>
    )
}
  return (
    <div className='homepage_container flex-row'>
            <div className='homepage_right flex-column'>
                <TeamDetailCard team={team} />
            </div>
            <div className='homepage_left flex-column'>
                <TeamTransactionBox team={team}/>
            </div>
        </div>
    )

}

export default TeamPage
