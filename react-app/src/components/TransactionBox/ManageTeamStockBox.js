
import React, { useState, useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { buyTeamStock } from '../../store/session'
import { useHistory } from "react-router-dom";


function ManageTeamStockBox({ teamStock, team }) {
    const [shares, setShares] = useState(0);
    const [value, setValue] = useState(0);

    const handleShareChange = (e) => {
        e.preventDefault()

        if (e.target.value >= 0 && e.target.value <= teamStock.shares) {

            setShares(e.target.value)

            setValue((parseFloat(team.current_price * e.target.value) / 100).toFixed(2))
        }


    }


    return (
        <div className='transactionBox_container '>
            <div className='transactionBox_body flex-column'>
                <div className='transactionBox_header flex-row'>
                    {`Manage ${team?.code}`}
                </div>
                <div className='transactionBox_main flex-column'>
                    <div className='transactionBox_row flex-row '>
                        <p className='transactionForm_label'>Shares Owned </p>
                        <p className='transactionForm_value'>{teamStock.shares}</p>
                    </div>
                    <div className='transactionBox_row flex-row '>
                        <p className='transactionForm_label'>Value</p>
                        <p className='transactionForm_value'>{`$${(parseFloat(teamStock.current_value) / 100).toFixed(2)}`}</p>
                    </div>
                    <form className='transactionBox_form'>
                        <div className='transactionBox_row flex-row '>
                            <p className='transactionForm_label'>Shares to Sell</p>
                            <input
                                className="transactionForm_input"
                                id="SharesInput"
                                type="number"
                                onChange={handleShareChange}
                                value={shares}
                                required />
                        </div>
                        <div className="transactionBox_total flex-row">
                            <p className='transactionForm_label'>Sale Return</p>
                            <p className='transactionForm_value'>{`$${value}`}</p>
                        </div>
                        <button type="submit" className="transactionBox_button">Sell Shares</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ManageTeamStockBox
