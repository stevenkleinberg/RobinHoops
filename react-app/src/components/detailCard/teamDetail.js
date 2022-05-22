import React from 'react'
import "./teamComp.css"

import TeamChart from '../chart/TeamChart';

function TeamDetailCard({ team }) {
    const floatPrice = parseFloat(team?.current_price);
    const floatInit = parseFloat(team?.init_price)
    const floatDifference = floatPrice - floatInit
    const displayDifference = (floatDifference / 100).toFixed(2);
    const floatPercentChange = ((floatDifference * 10000) / floatInit);
    const displayPercentChange = (floatPercentChange / 100).toFixed(2);
    const displayPrice = (floatPrice / 100).toFixed(2);
    const wins = Math.ceil((team?.win_loss_ratio * team?.games_played) / 1000);
    const losses = team?.games_played - wins;
    const displayRatio = (parseFloat(team?.win_loss_ratio) / 1000).toFixed(3)
    return (
        <div className='DetailCard_container flex-column'>
            <div className='detailcard_top flex-row'>
                <div className='detailcard_top_left'>
                    <div className='detailcard_header'>{team?.name}</div>
                    <div className='detailcard_number_box'>
                        <div className='current_price'>{"$" + displayPrice}</div>
                        <div className='price_change'>{`$${displayDifference} (${displayPercentChange}%)`}</div>
                    </div>
                </div>
                <div className='detailcard_top_right'>
                    <div className='detailcard_logo'>
                        <img src={team?.logo} />
                    </div>
                </div>
            </div>
            <div className='detailcard_chartSection'>
                <TeamChart team={team} />
            </div>
            <div className='about'>
                <div className='about_header'>About</div>
                <div className='about_info flex-row'>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Record</p>
                        <p className='info_detail'>{`${wins} - ${losses}`}</p>
                    </div>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Conference</p>
                        <p className='info_detail'>{team?.conference}</p>
                    </div>

                    <div className='info_column flex-column'>
                        <p className='info_label'>Hometown</p>
                        <p className='info_detail'>{team?.city}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamDetailCard
