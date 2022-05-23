import React, { useState, useEffect } from "react";
import MyPlayerStockCard from "./MyPlayerStockCard";
function MyPlayersList({player_stocks}) {
    const [showDropdown, setShowDropdown] = useState(false);


    const openDropdown = () => {
        if (showDropdown) return;
        setShowDropdown(true);
    };

    useEffect(() => {
        if (!showDropdown) return;

        const closeDropdown = () => {
            setShowDropdown(false);
        };

        document.addEventListener("click", closeDropdown);

        return () => document.removeEventListener("click", closeDropdown);
    }, [showDropdown]);
  if (!player_stocks.length){
    return (
        <></>
    )
  }
  return (
    <div className='stocklist_players flex-column '>
            <div className='stockListHeader flex-row' onClick={openDropdown}>
                <p>My Players</p>
                {showDropdown && (
                    <div className='dropdown_btn_up' >
                        &#10148;
                    </div>
                )}
                {!showDropdown && (
                    <div className='dropdown_btn_down' >
                        &#10148;
                    </div>
                )}
            </div>
            {showDropdown && (
                <div className='stocklist_dropdown'>
                    {player_stocks.map(player_stock => (
                        <MyPlayerStockCard player_stock={player_stock} key={player_stock.id} />
                    ))}
                </div>
            )}
        </div>
  )
}

export default MyPlayersList
