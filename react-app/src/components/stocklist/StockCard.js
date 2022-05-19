import React from 'react'
import { NavLink,  } from "react-router-dom";

function StockCard({team}) {
  const floatPrice = parseFloat(team.current_price)
  const displayPrice = (floatPrice / 100 ).toFixed(2)
  return (
    <NavLink to={`/teams/${team.id}`} className='stockCard_body flex-row'>
        <div className='stock_Name'>{team.code}</div>
        <div className='stock_logo flex-column'><img src={team.logo}/></div>
        <div className='stock_price'>{`$${displayPrice}`}</div>
    </NavLink>
  )
}

export default StockCard
