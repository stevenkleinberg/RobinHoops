import React from 'react'
import { useSelector } from "react-redux";

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
    const displayDifference = (floatDifference /100).toFixed(2);
    const floatPercentChange =(floatDifference * 100 / floatInit).toFixed(2);
    const displayPercentChange=(floatPercentChange / 100).toFixed(2);
    const cashPercent = (((floatTotal - floatAsset) * 100 / floatTotal)).toFixed(2)
    const assetPercent = (((floatTotal - floatCash) * 100 / floatTotal)).toFixed(2)
    let   mostShares  = { shares: 0, team_id:-1}
    const team_stocks = user?.team_stocks
    team_stocks.forEach((stock) => {
        if (stock.shares > mostShares.shares){
            mostShares = stock
        }
    } )
    const mostSharesValue = (parseFloat(mostShares.current_value) / 100 ).toFixed(2);
    const mostSharesCode = useSelector(state => state.teams[mostShares?.team_id]?.code);


  return (
    <div className='DetailCard_container flex-column'>
            <div className='detailcard_top'>
                <div className='detailcard_header'>Portfollio</div>
                <div className='detailcard_number_box'>
                    <div className='current_price'>{"$" + displayTotal}</div>
                    <div className='price_change'>{`+$${displayDifference} (+${displayPercentChange}%)`}</div>
                </div>
            </div>
            <div className='detailcard_chartSection'>
                <div className='chart'>chart</div>
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
                    <div className='info_column flex-column'>
                        <p className='info_label'>Largset Team Stake</p>
                        <p className='info_detail'>{mostSharesCode}</p>
                        <p className='info_detail'>{`$${mostSharesValue} (${mostShares.shares} shares)`}</p>
                    </div>
                    <div className='info_column flex-column'>
                        <p className='info_label'>Largset Player Stake</p>
                        <p className='info_detail'>coming soon</p>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default UserDetail
