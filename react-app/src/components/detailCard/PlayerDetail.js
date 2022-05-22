
import React from 'react'
import "./teamComp.css"
import { useSelector } from "react-redux";
import PlayerChart from '../chart/PlayerChart';
function PlayerDetail({ player }) {
    const team = useSelector(state => state.teams[player?.team_id])
    const floatPrice = parseFloat(player?.current_price);
    const floatInit = parseFloat(player?.init_price)
    const floatDifference = floatPrice - floatInit
    const displayDifference = (floatDifference / 100).toFixed(2);
    const floatPercentChange = ((floatDifference * 10000) / floatInit);
    const displayPercentChange = (floatPercentChange / 100).toFixed(2);
    const displayPrice = (floatPrice / 100).toFixed(2);
    const floatPPG = parseFloat(player?.ppg);
    const displayPPG = (floatPPG / 100).toFixed(2);

    return (
        <div className='DetailCard_container flex-column'>
            <div className='detailcard_top flex-row'>
                <div className='detailcard_top_left'>
                    <div className='detailcard_header'>{player?.name}</div>
                    <div className='detailcard_number_box'>
                        <div className='current_price'>{"$" + displayPrice}</div>
                        <div className='price_change'>{`+$${displayDifference} (+${displayPercentChange}%)`}</div>
                    </div>
                </div>
                <div className='detailcard_top_right'>
                    <div className='detailcard_logo'>
                        <img src={team?.logo} />
                    </div>
                </div>
            </div>
            <div className='detailcard_chartSection'>
                <PlayerChart player={player} />
            </div>
            <div className='about'>
                <div className='about_header'>About</div>
                <div className='about_info flex-row'>
                    <div className='info_column flex-column'>
                        <p className='info_label'>PPG</p>
                        <p className='info_detail'>{displayPPG}</p>
                    </div>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Games Played</p>
                        <p className='info_detail'>{player?.games_played}</p>
                    </div>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Last Five</p>
                        <p className='info_detail'> 11pts , 12pts, 18pts </p>
                    </div>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Position</p>
                        <p className='info_detail'>{"nope"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerDetail
