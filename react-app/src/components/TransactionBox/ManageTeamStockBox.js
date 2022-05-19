
import React, { useState, useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SellEntireTeamStock, SellSharesOfTeamStock } from '../../store/session'
import { useHistory, Redirect} from "react-router-dom";


function ManageTeamStockBox({ teamStockInit, team, setIsOwned}) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [teamStock, setTeamStock] = useState(teamStockInit)
    const [shares, setShares] = useState(0);
    const [value, setValue] = useState(0);

    const handleShareChange = (e) => {
        e.preventDefault()
        if (e.target.value >= 0 && e.target.value <= teamStock.shares) {
            setShares(e.target.value)
            setValue((parseFloat(team.current_price * e.target.value) / 100).toFixed(2))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //if number of sold shares = number owned we delete
        if( shares > 0){
            if(shares == teamStock.shares){
              const data = await dispatch(SellEntireTeamStock(teamStock.id))
              if (data.errors) {
                  console.log("error", data.errors)
              } else {
                setIsOwned(false)
              }
            }
            // if number of sold shares < shares owned we edit
            else {
                const edit_teamStock = {
                    id: teamStock.id,
                    user_id: teamStock.user_id,
                    team_id : teamStock.team_id,
                    shares,
                    purchase_price: teamStock.purchase_price
                }
                const data = await dispatch(SellSharesOfTeamStock(edit_teamStock))
                if (data.errors) {
                    console.log("error", data.errors)
                }else{
                    data.team_stocks.forEach(stock => {
                        if(stock.id === teamStock.id){
                            setTeamStock(stock)
                        }
                    });
                    setShares(0)
                    setValue(0)
                }
            }
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
                        <p className='transactionForm_value'>{teamStock?.shares}</p>
                    </div>
                    <div className='transactionBox_row flex-row '>
                        <p className='transactionForm_label'>Value</p>
                        <p className='transactionForm_value'>{`$${(parseFloat(teamStock?.current_value) / 100).toFixed(2)}`}</p>
                    </div>
                    <form className='transactionBox_form' onSubmit={handleSubmit}>
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
