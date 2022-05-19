import React from 'react'
import { NavLink,  } from "react-router-dom";
import { useSelector } from "react-redux";

function PlayerCard({ player }) {
    const floatPrice = parseFloat(player.current_price)
    const displayPrice = (floatPrice / 100 ).toFixed(2)
    const splitName = player.name.split(" ")
    const firstInital = splitName[0][0]
    const lastName = splitName[1]
    const displayName =`${firstInital}. ${lastName}`
    const logo = useSelector(state => state.teams[player.team_id].logo)
  return (
    <NavLink to={`/players/${player.id}`} className='stockCard_body flex-row'>
        <div className='stock_Name'>{displayName}</div>
        <div className='stock_logo flex-column'><img src={logo}/></div>
        <div className='stock_price'>{`$${displayPrice}`}</div>
    </NavLink>
  )
}

export default PlayerCard
