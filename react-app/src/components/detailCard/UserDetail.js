import React from 'react'
import { useSelector } from "react-redux";
import logo from "../../static/images/nba_white.png"

function UserDetail() {
    const user = useSelector(state => state.session.user)

    const floatCash = parseFloat(user?.cash_value);
    const displayCash = (floatCash / 100).toFixed(2);
    const floatAsset = parseFloat(user?.assets_value);
    const displayAssets = (floatAsset / 100).toFixed(2);
    const floatInit = parseFloat(user?.init_value);
    const floatTotal = floatAsset + floatCash;
    const displayTotal = (floatTotal / 100).toFixed(2);
    const floatDifference = floatTotal - floatInit;
    const displayDifference = (floatDifference / 100).toFixed(2);
    const floatPercentChange = ((floatDifference * 10000) / floatInit);
    const displayPercentChange = (floatPercentChange / 100).toFixed(2);
    const cashPercent = (((floatTotal - floatAsset) * 100 / floatTotal)).toFixed(2)
    const assetPercent = (((floatTotal - floatCash) * 100 / floatTotal)).toFixed(2)
    let team_mostShares = { shares: 0, team_id: -1 }
    const team_stocks = user?.team_stocks
    team_stocks.forEach((stock) => {
        if (stock.shares > team_mostShares.shares) {
            team_mostShares = stock
        }
    })
    const team_mostSharesValue = (parseFloat(team_mostShares.current_value) / 100).toFixed(2);
    const team_mostSharesCode = useSelector(state => state.teams[team_mostShares?.team_id]?.code);
    let player_mostShares = { shares: 0, player_id: -1 }
    const player_stocks = user?.player_stocks
    player_stocks.forEach((stock) => {
        if (stock.shares > player_mostShares.shares) {
            player_mostShares = stock
        }
    })
    const player_mostSharesValue = (parseFloat(player_mostShares.current_value) / 100).toFixed(2);
    const player_mostSharesName = useSelector(state => state.players[player_mostShares?.player_id]?.name);


    return (
        <div className='DetailCard_container flex-column'>
            <div className='detailcard_top flex-row'>
                <div className='detailcard_top_left'>
                    <div className='detailcard_header'>Portfolio</div>
                    <div className='detailcard_number_box'>
                        <div className='current_price'>{"$" + displayTotal}</div>
                        <div className='price_change'>{displayDifference > 0 ? `+$${displayDifference} (+${displayPercentChange}%)` : `$${displayDifference} (${displayPercentChange}%)`}</div>
                    </div>
                </div>
                <div className='detailcard_top_right'>
                    <div className='detailcard_app_logo'>
                        <img src={logo} />
                    </div>
                </div>
            </div>
            <div className='detailcard_chartSection'>
                <div className='chart_header'>Upcoming Games</div>
            </div>
            <div className='about'>
                <div className='about_header'>About</div>
                <div className='about_info flex-row'>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Cash</p>
                        <p className='info_detail'>{`$${displayCash} (${cashPercent}%)`}</p>
                    </div>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Assets</p>
                        <p className='info_detail'>{`$${displayAssets} (${assetPercent}%)`}</p>
                    </div>
                    {team_stocks.length > 0 && (
                        <div className='info_column flex-column'>
                            <p className='info_label'>Largest Team Stake</p>
                            <>
                                <p className='info_detail'>{team_mostSharesCode}</p>
                                <p className='info_detail'>{`$${team_mostSharesValue} (${team_mostShares.shares} shares)`}</p>
                            </>
                        </div>
                    )}
                    {player_stocks.length > 0 && (
                        <div className='info_column flex-column'>
                            <p className='info_label'>Largest Player Stake</p>
                            <>
                                <p className='info_detail'>{player_mostSharesName}</p>
                                <p className='info_detail'>{`$${player_mostSharesValue} (${player_mostShares.shares} shares)`}</p>
                            </>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDetail
