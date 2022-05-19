
import React, { useState, useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SellEntirePlayerStock, SellSharesOfPlayerStock } from '../../store/session'
import { useHistory, Redirect} from "react-router-dom";

function ManagePlayerStockBox({playerStockInit, player, setIsOwned}) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [playerStock, setPlayerStock] = useState(playerStockInit)
    const [shares, setShares] = useState(0);
    const [value, setValue] = useState(0);
    const splitName = player.name.split(" ")
    const firstInital = splitName[0][0]
    const lastName = splitName[1]
    const displayName =`${firstInital}. ${lastName}`

    const handleShareChange = (e) => {
        e.preventDefault()
        if (e.target.value >= 0 && e.target.value <= playerStock.shares) {
            setShares(e.target.value)
            setValue((parseFloat(player.current_price * e.target.value) / 100).toFixed(2))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //if number of sold shares = number owned we delete
        if( shares > 0){
            if(shares == playerStock.shares){
              const data = await dispatch(SellEntirePlayerStock(playerStock.id))
              if (data.errors) {
                  console.log("error", data.errors)
              } else {
                setIsOwned(false)
              }
            }
            // if number of sold shares < shares owned we edit
            else {
                const edit_playerStock = {
                    id: playerStock.id,
                    user_id: playerStock.user_id,
                    player_id : playerStock.player_id,
                    shares,
                    purchase_price: playerStock.purchase_price
                }
                const data = await dispatch(SellSharesOfPlayerStock(edit_playerStock))
                if (data.errors) {
                    console.log("error", data.errors)
                }else{
                    data.player_stocks.forEach(stock => {
                        if(stock.id === playerStock.id){
                            setPlayerStock(stock)
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
            {`Manage ${displayName}`}
        </div>
        <div className='transactionBox_main flex-column'>
            <div className='transactionBox_row flex-row '>
                <p className='transactionForm_label'>Shares Owned </p>
                <p className='transactionForm_value'>{playerStock?.shares}</p>
            </div>
            <div className='transactionBox_row flex-row '>
                <p className='transactionForm_label'>Value</p>
                <p className='transactionForm_value'>{`$${(parseFloat(playerStock?.current_value) / 100).toFixed(2)}`}</p>
            </div>
            <form className='transactionBox_form' onSubmit={handleSubmit} >
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

export default ManagePlayerStockBox
