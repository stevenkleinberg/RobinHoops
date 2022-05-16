import React from 'react'

function TeamDetailCard({team}) {
    const floatPrice = parseFloat(team?.current_price)
    const displayPrice = (floatPrice / 100 ).toFixed(2)
  return (
    <div className='DetailCard_container flex-column'>
        <div className='detailcard_header'>{team?.name}</div>
        <div className='detailcard_chartSection'>
            <div className='detailcard_number_box'>
                <div className='current_price'>{"$" + displayPrice}</div>
                <div className='price_change'></div>
            </div>
            <div className='chart'></div>
            <div className='about'>
                <div className='about_header'>About</div>
                <div className='about_info'>
                    info section
                </div>
            </div>
        </div>
    </div>
  )
}

export default TeamDetailCard
