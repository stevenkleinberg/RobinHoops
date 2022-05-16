import React, { useState, useEffect } from "react";
import StockList from './stocklist'
import TeamDetailCard from "./detailCard/teamDetail";
import { useSelector, useDispatch } from "react-redux";


function Homepage() {
    const dispatch = useDispatch()






    return (
        <div className='homepage_container flex-row'>
            <div className='homepage_right flex-column'>
                {/* <DetailCard /> */}
            </div>
            <div className='homepage_left flex-column'>
                <StockList />
            </div>
        </div>
    )
}

export default Homepage
