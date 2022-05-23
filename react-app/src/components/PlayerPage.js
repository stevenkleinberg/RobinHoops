import React, { useState, useEffect, } from "react";
import StockList from './stocklist'
import PlayerDetail from "./detailCard/PlayerDetail";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams  } from "react-router-dom";
import TeamTransactionBox from "./TransactionBox/TeamTransactionBox";
import PlayerTransactionBox from "./TransactionBox/PlayerTransactionBox";

function PlayerPage() {
    const { id }= useParams()
    const player = useSelector(state => state.players[id])
  if(!player){
      return(
        <></>
      )
  }
  return (
    <div className='homepage_container flex-row'>
            <div className='homepage_right flex-column'>
                <PlayerDetail player={player} />
            </div>
            <div className='homepage_left flex-column'>
                <PlayerTransactionBox player={player}/>
            </div>
        </div>
  )
}

export default PlayerPage
