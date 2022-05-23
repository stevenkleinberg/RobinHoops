
import React, { useState, useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SellEntireTeamStock, SellSharesOfTeamStock, BuySharesOfTeamStock} from '../../store/session'
import { useHistory, Redirect } from "react-router-dom";


function ManageTeamStockBox({ teamStockInit, team, setIsOwned }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [teamStock, setTeamStock] = useState(teamStockInit)
    const [shares, setShares] = useState(0);
    const [value, setValue] = useState(0);
    const [errors, setErrors] = useState([])
    const [newTotal, setNewTotal] = useState(0)
    const [newShares, setNewShares] = useState(0)
    const [buyMore, setBuyMore] = useState(false)
    const user = useSelector(state => state.session.user)
    const floatBalance = parseFloat(user.cash_value)
    const displayBalance = (floatBalance / 100).toFixed(2);

    const handleShareChange = (e) => {
        e.preventDefault()
        const errs = [];
        if (!buyMore && e.target.value >= 0 && e.target.value <= teamStock.shares) {
            setShares(e.target.value)
            setValue((parseFloat(team.current_price * e.target.value) / 100).toFixed(2))
        } else if (!buyMore && e.target.value >= teamStock.shares) {
            errs.push(`Max Shares to Sell: ${teamStock.shares} shares`)
            setShares(0)
            setValue(0)
        }

        if (buyMore && parseFloat(team.current_price * e.target.value) > floatBalance) {
            errs.push(`Insufficient Funds: Max Purchase ${parseInt(floatBalance / parseFloat(team.current_price))} shares`)
            setShares(0)
            setValue(0)
            setNewTotal(0)
            setNewShares(0)
        }
        else if (buyMore && e.target.value > 0) {
            setShares(e.target.value)
            setValue((parseFloat(team.current_price * e.target.value) / 100).toFixed(2))
            setNewTotal((parseFloat(teamStock?.current_value + (team?.current_price * e.target.value)) / 100).toFixed(2))
            setNewShares((parseFloat(e.target.value) + parseFloat(teamStock?.shares)))
        }
        else if (buyMore && e.target.value == 0) {
            setShares(e.target.value)
            setValue((parseFloat(team.current_price * e.target.value) / 100).toFixed(2))
            setNewTotal(0)
            setNewShares(0)
        }
        setErrors(errs)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //if number of sold shares = number owned we delete
        const errs = [];
        if (!errors.length) {
            if (shares > 0) {
                if (shares == teamStock.shares) {
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
                        team_id: teamStock.team_id,
                        shares,
                        purchase_price: teamStock.purchase_price
                    }
                    const data = await dispatch(SellSharesOfTeamStock(edit_teamStock))
                    if (data.errors) {
                        console.log("error", data.errors)
                    } else {
                        data.team_stocks.forEach(stock => {
                            if (stock.id === teamStock.id) {
                                setTeamStock(stock)
                            }
                        });
                        setShares(0)
                        setValue(0)
                    }
                }
            } else {
                errs.push("Cannot transact 0 shares")
            }
            setErrors(errs)
        }
    }

    useEffect(() => {
        setShares(0)
        setValue(0)
        setNewTotal(0)
        setNewShares(0)
        setErrors([])

    }, [buyMore])


    const handleSubmit_buymore = async (e) => {
        e.preventDefault()
        const errs = [];
        if (!errors.length) {
            if (shares > 0) {
                const edit_teamStock = {
                    id: teamStock.id,
                    user_id: teamStock.user_id,
                    team_id: teamStock.team_id,
                    shares,
                    purchase_price: teamStock.purchase_price
                }
                const data = await dispatch(BuySharesOfTeamStock(edit_teamStock))
                if (data.errors) {
                    console.log("error", data.errors)
                } else {
                    data.team_stocks.forEach(stock => {
                        if (stock.id === teamStock.id) {
                            setTeamStock(stock)
                        }
                    });
                    setBuyMore(false)
                }
            } else {
                errs.push("Cannot transact 0 shares")
            }
        setErrors(errs)
        }
    }


    if (buyMore) {
        return (
            <div className='transactionBox_container '>
                <div className='transactionBox_body_2 flex-column'>
                    <div className='transactionBox_header flex-row'>
                        {`Manage ${team?.code}`}
                    </div>
                    <div className='transactionBox_errors'>
                        {errors.map((error, ind) => (
                            <div className='transactionBox_row flex-row' key={ind}>{error}</div>
                        ))}
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
                        <form className='transactionBox_form' onSubmit={handleSubmit_buymore} >
                            <div className='transactionBox_row flex-row '>
                                <p className='transactionForm_label'>Shares to Buy</p>
                                <input
                                    className="transactionForm_input"
                                    id="SharesInput"
                                    type="number"
                                    onChange={handleShareChange}
                                    value={shares}
                                    required />
                            </div>
                            <div className="transactionBox_total flex-row">
                                <p className='transactionForm_label'>New Value</p>
                                <p className='transactionForm_value'>{`$${newTotal}`}</p>
                            </div>
                            <div className='transactionBox_row flex-row '>
                                <p className='transactionForm_label'>New Share Total</p>
                                <p className='transactionForm_value'>{newShares}</p>
                            </div>
                            <div className="transactionBox_total flex-row">
                                <p className='transactionForm_label'>Estimated cost</p>
                                <p className='transactionForm_value'>{`$${value}`}</p>
                            </div>
                            <button type="submit" className="transactionBox_button">Buy Shares</button>
                            <div className="transactionForm_bottom flex-column">
                                <p className="transactionForm_balance">{`$${displayBalance} Available`}</p>
                                <p className="transactionForm_Type" onClick={() => setBuyMore(false)} >Sell Shares</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='transactionBox_container '>
            <div className='transactionBox_body flex-column'>
                <div className='transactionBox_header flex-row'>
                    {`Manage ${team?.code}`}
                </div>
                <div className='transactionBox_errors'>
                    {errors.map((error, ind) => (
                        <div className='transactionBox_row flex-row' key={ind}>{error}</div>
                    ))}
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
                        <div className="transactionForm_bottom flex-row" onClick={() => setBuyMore(true)}>
                            <p className="transactionForm_Type">Buy More?</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ManageTeamStockBox
