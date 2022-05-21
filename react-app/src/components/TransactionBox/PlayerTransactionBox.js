import React, { useState, useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { buyPlayerStock } from '../../store/session'
import { useHistory, useParams } from "react-router-dom";
import ManagePlayerStockBox from "./ManagePlayerStockBox";

import './TransactionBox.css'

export default function PlayerTransactionBox({ player }) {
    const dispatch = useDispatch()
    const { id } = useParams()
    const userPlayerstocks = useSelector(state => state.session.user.player_stocks)
    const [isOwned, setIsOwned] = useState(false)
    const [playerStock, setPlayerStock] = useState()
    const [shares, setShares] = useState(0);
    const [total, setTotal] = useState(parseFloat(0));
    const [displayTotal, setDisplayTotal] = useState(0.00);
    const floatPrice = parseFloat(player?.current_price);
    const displayPrice = (floatPrice / 100).toFixed(2);
    const user = useSelector(state => state.session.user)
    const floatBalance = parseFloat(user.cash_value)
    const displayBalance = (floatBalance / 100).toFixed(2);
    const splitName = player?.name.split(" ")
    const firstInital =splitName?  splitName[0][0] : ""
    const lastName = splitName ? splitName[1] : ""
    const displayName = `${firstInital}. ${lastName}`
    const [errors, setErrors] = useState([])

    useEffect(() => {
        userPlayerstocks.forEach(playerStock => {
            if (playerStock.player_id == id) {
                setPlayerStock(playerStock)
                setIsOwned(true)
            }
        })
    }, []);

    const handleShareChange = (e) => {
        const errs = [];
        e.preventDefault()
        if (parseFloat(player.current_price * e.target.value) < floatBalance) {
            if (e.target.value >= 0) {
                setShares(e.target.value)
                setTotal(floatPrice * e.target.value)
            }
            setDisplayTotal((total / 100).toFixed(2))
        } else {
            errs.push(`Insufficient Funds: Max Purchase ${parseInt(floatBalance / parseFloat(player.current_price)) } shares`)
            setShares(0)
            setTotal(0)
        }
        setErrors(errs)
    }


    useEffect(() => {
        setDisplayTotal((total / 100).toFixed(2))
    }, [total]);


    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = [];
        if (!errors.length) {
            if (shares > 0) {
                const newPlayerStock = {
                    user_id: user.id,
                    player_id: player.id,
                    shares,
                    purchase_price: floatPrice,
                    current_value: total,
                }
                const data = await dispatch(buyPlayerStock(newPlayerStock))
                if (data.errors) {
                    console.log("error", data.errors)
                } else {
                    data.player_stocks?.forEach(playerStock => {
                        if (playerStock.player_id == id) {
                            setPlayerStock(playerStock)
                            setIsOwned(true)
                        }
                    })
                }
            }else{
                errs.push("Cannot transact 0 shares")
            }
            setErrors(errs)
        }
    }

    if (isOwned) {
        return (
            <ManagePlayerStockBox playerStockInit={playerStock} player={player} setIsOwned={setIsOwned} />
        )
    }
    return (
        <div className='transactionBox_container '>
            <div className='transactionBox_body flex-column'>
                <div className='transactionBox_header flex-row'>
                    {`Buy ${displayName}`}
                </div>
                <div className='transactionBox_errors'>
                    {errors.map((error, ind) => (
                        <div className='transactionBox_row flex-row' key={ind}>{error}</div>
                    ))}
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
                            <p className="transactionForm_balance">{`$${displayBalance} Available`}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
