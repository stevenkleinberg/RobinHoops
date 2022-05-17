import React, { useState, useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {buyTeamStock} from '../../store/session'
import { useHistory, useParams } from "react-router-dom";
import ManageTeamStockBox from "./ManageTeamStockBox";

import './TransactionBox.css'
function TeamTransactionBox({ team }) {
    const dispatch = useDispatch()
    const { id } = useParams()
    const userTeamstocks = useSelector(state => state.session.user.team_stocks)
    const [isOwned, setIsOwned] = useState(false)
    const [teamStock, setTeamStock] = useState()
    const [shares, setShares] = useState(0);
    const [total, setTotal] = useState(parseFloat(0));
    const [displayTotal, setDisplayTotal] = useState(0.00);
    const history = useHistory();
    const floatPrice = parseFloat(team?.current_price);
    const displayPrice = (floatPrice / 100).toFixed(2);
    const user = useSelector(state => state.session.user)
    const floatBalance = parseFloat(user.cash_value)
    const displayBalance = (floatBalance / 100).toFixed(2);

    useEffect(() => {
        userTeamstocks.forEach(teamStock => {
            if( teamStock.team_id == id) {
                setTeamStock(teamStock)
                setIsOwned(true)
            }
        })
    }, []);



    const handleShareChange = (e) => {
        e.preventDefault()

        if (e.target.value >= 0) {

            setShares(e.target.value)

            setTotal(floatPrice * e.target.value)
        }

        setDisplayTotal((total / 100).toFixed(2))
    }

    useEffect(() => {
        setDisplayTotal((total / 100).toFixed(2))
    }, [total]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newTeamStock = {
            user_id: user.id,
            team_id: team.id,
            shares,
            purchase_price: floatPrice,
            current_value: total,
            }
        const data = await dispatch(buyTeamStock(newTeamStock))
        if (data.errors) {
           console.log("error", data.errors)
          } else {
            data.team_stocks.forEach(teamStock => {
                if( teamStock.team_id === team.id) {
                    setTeamStock(teamStock)
                    setIsOwned(true)
                }
            })
          }
    }
    if(isOwned){
        return(
            <ManageTeamStockBox teamStock={teamStock} team={team} />
        )
    }
    return (
        <div className='transactionBox_container '>
            <div className='transactionBox_body flex-column'>
                <div className='transactionBox_header flex-row'>
                    {`Buy ${team?.code}`}
                </div>
                <div className='transactionBox_main flex-column'>
                    <form className='transactionBox_form' onSubmit={handleSubmit}>
                        <div className='transactionBox_row flex-row '>
                            <p className='transactionForm_label'>Shares</p>
                            <input
                                className="transactionForm_input"
                                id="SharesInput"
                                type="number"
                                onChange={handleShareChange}
                                value={shares}
                                required />
                        </div>
                        <div className='transactionBox_row flex-row '>
                            <p className='transactionForm_label'>Share Price</p>
                            <p className='transactionForm_value'>{displayPrice}</p>
                        </div>
                        <div className="transactionBox_total flex-row">
                            <p className='transactionForm_label'>Estimated cost</p>
                            <p className='transactionForm_value'>{`$${displayTotal}`}</p>
                        </div>
                        <button type="submit" className="transactionBox_button">Purchase</button>
                        <div className="transactionForm_bottom flex-row">
                            <p className="transactionForm_balance">{`$${displayBalance} Available to trade`}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TeamTransactionBox
